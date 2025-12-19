import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Input validation constants
const MAX_EMAIL_LENGTH = 10000;
const MAX_SUBJECT_LENGTH = 500;
const MAX_SENDER_LENGTH = 255;
const VALID_TONES = ['professional', 'friendly', 'concise'];

interface ValidatedInput {
  emailSubject: string;
  emailFrom: string;
  emailBody: string;
  tone: string;
}

function validateInput(body: unknown): { valid: boolean; error?: string; data?: ValidatedInput } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: "Invalid request body" };
  }

  const { emailSubject, emailFrom, emailBody, tone = 'professional' } = body as Record<string, unknown>;

  if (typeof emailSubject !== 'string' || emailSubject.length === 0) {
    return { valid: false, error: "emailSubject is required" };
  }
  if (emailSubject.length > MAX_SUBJECT_LENGTH) {
    return { valid: false, error: `emailSubject must be less than ${MAX_SUBJECT_LENGTH} characters` };
  }

  if (typeof emailFrom !== 'string' || emailFrom.length === 0) {
    return { valid: false, error: "emailFrom is required" };
  }
  if (emailFrom.length > MAX_SENDER_LENGTH) {
    return { valid: false, error: `emailFrom must be less than ${MAX_SENDER_LENGTH} characters` };
  }

  if (typeof emailBody !== 'string' || emailBody.length === 0) {
    return { valid: false, error: "emailBody is required" };
  }
  if (emailBody.length > MAX_EMAIL_LENGTH) {
    return { valid: false, error: `emailBody must be less than ${MAX_EMAIL_LENGTH} characters` };
  }

  if (typeof tone !== 'string' || !VALID_TONES.includes(tone)) {
    return { valid: false, error: `tone must be one of: ${VALID_TONES.join(', ')}` };
  }

  return {
    valid: true,
    data: {
      emailSubject: emailSubject.trim(),
      emailFrom: emailFrom.trim(),
      emailBody: emailBody.trim(),
      tone,
    },
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Parse and validate input
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const validation = validateInput(body);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { emailSubject, emailFrom, emailBody, tone } = validation.data!;
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      return new Response(JSON.stringify({ error: 'Service configuration error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const systemPrompt = `You are a professional email assistant. Generate a thoughtful, contextually appropriate reply to emails. 
Your replies should be:
- ${tone === 'professional' ? 'Professional and business-appropriate' : tone === 'friendly' ? 'Warm and friendly while remaining professional' : 'Concise and direct'}
- Relevant to the email content
- Clear and well-structured
- Appropriately addressed to the sender
Do not include subject lines, just the email body. Start with an appropriate greeting.`;

    const userPrompt = `Generate a reply to this email:

From: ${emailFrom}
Subject: ${emailSubject}

Email Content:
${emailBody}

Generate an appropriate reply:`;

    console.log('Generating AI reply for user:', user.id);

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      console.error('AI gateway error:', response.status);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      return new Response(JSON.stringify({ error: 'Failed to generate reply' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const generatedReply = data.choices?.[0]?.message?.content;

    console.log('Successfully generated AI reply for user:', user.id);

    return new Response(JSON.stringify({ reply: generatedReply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-ai-reply:', error);
    return new Response(JSON.stringify({ error: 'An unexpected error occurred' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
