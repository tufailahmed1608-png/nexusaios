import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY')!;

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Create client with user's token for RLS
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get user
    const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { action, query, title, content, documentId } = await req.json();

    if (action === 'upload') {
      // Upload a new document
      if (!title || !content) {
        return new Response(JSON.stringify({ error: 'Title and content are required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          title,
          content,
        })
        .select()
        .single();

      if (error) {
        console.error('Insert error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true, document: data }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'delete') {
      if (!documentId) {
        return new Response(JSON.stringify({ error: 'Document ID is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Delete error:', error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (action === 'query') {
      // Search documents and generate response with AI
      if (!query) {
        return new Response(JSON.stringify({ error: 'Query is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Full-text search for relevant documents
      const { data: documents, error: searchError } = await supabase
        .from('documents')
        .select('id, title, content')
        .eq('user_id', user.id)
        .textSearch('search_vector', query.split(' ').join(' | '))
        .limit(5);

      if (searchError) {
        console.error('Search error:', searchError);
        return new Response(JSON.stringify({ error: searchError.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // If no documents found with full-text search, try a broader search
      let relevantDocs = documents || [];
      if (relevantDocs.length === 0) {
        const { data: allDocs } = await supabase
          .from('documents')
          .select('id, title, content')
          .eq('user_id', user.id)
          .limit(5);
        relevantDocs = allDocs || [];
      }

      // Build context from retrieved documents
      const context = relevantDocs.length > 0
        ? relevantDocs.map(doc => `Document: ${doc.title}\n${doc.content}`).join('\n\n---\n\n')
        : 'No documents found in the knowledge base.';

      // Generate response using Lovable AI
      const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${lovableApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            {
              role: 'system',
              content: `You are a helpful assistant that answers questions based on the company's document knowledge base. 
Use the provided context to answer questions accurately. If the context doesn't contain relevant information, 
say so honestly and provide general guidance if appropriate.

Always cite which document(s) you used to answer the question when applicable.`
            },
            {
              role: 'user',
              content: `Context from knowledge base:\n\n${context}\n\n---\n\nUser question: ${query}`
            }
          ],
        }),
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error('AI API error:', aiResponse.status, errorText);
        
        if (aiResponse.status === 429) {
          return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
            status: 429,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        if (aiResponse.status === 402) {
          return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add funds.' }), {
            status: 402,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        
        return new Response(JSON.stringify({ error: 'Failed to generate AI response' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const aiData = await aiResponse.json();
      const answer = aiData.choices?.[0]?.message?.content || 'Unable to generate response.';

      return new Response(JSON.stringify({
        answer,
        sources: relevantDocs.map(doc => ({ id: doc.id, title: doc.title })),
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in rag-query:', error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
