import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation constants
const MAX_CONTENT_LENGTH = 20000;
const MAX_SENDER_LENGTH = 255;
const MAX_SUBJECT_LENGTH = 500;
const VALID_CONTENT_TYPES = ['email', 'meeting', 'transcript'];

interface ValidatedInput {
  content: string;
  contentType: string;
  sender?: string;
  subject?: string;
}

function validateInput(body: unknown): { valid: boolean; error?: string; data?: ValidatedInput } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: "Invalid request body" };
  }

  const { content, contentType, sender, subject } = body as Record<string, unknown>;

  if (typeof content !== 'string' || content.length === 0) {
    return { valid: false, error: "content is required" };
  }
  if (content.length > MAX_CONTENT_LENGTH) {
    return { valid: false, error: `content must be less than ${MAX_CONTENT_LENGTH} characters` };
  }

  if (typeof contentType !== 'string' || !VALID_CONTENT_TYPES.includes(contentType)) {
    return { valid: false, error: `contentType must be one of: ${VALID_CONTENT_TYPES.join(', ')}` };
  }

  let validatedSender: string | undefined;
  if (sender !== undefined) {
    if (typeof sender !== 'string') {
      return { valid: false, error: "sender must be a string" };
    }
    if (sender.length > MAX_SENDER_LENGTH) {
      return { valid: false, error: `sender must be less than ${MAX_SENDER_LENGTH} characters` };
    }
    validatedSender = sender.trim();
  }

  let validatedSubject: string | undefined;
  if (subject !== undefined) {
    if (typeof subject !== 'string') {
      return { valid: false, error: "subject must be a string" };
    }
    if (subject.length > MAX_SUBJECT_LENGTH) {
      return { valid: false, error: `subject must be less than ${MAX_SUBJECT_LENGTH} characters` };
    }
    validatedSubject = subject.trim();
  }

  return {
    valid: true,
    data: {
      content: content.trim(),
      contentType,
      sender: validatedSender,
      subject: validatedSubject,
    },
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication check
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse and validate input
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validation = validateInput(body);
    if (!validation.valid) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { content, contentType, sender, subject } = validation.data!;

    console.log("Generating task suggestions for user:", user.id, "type:", contentType);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "Service configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const systemPrompt = `You are an expert project management assistant. Your role is to analyze email content or meeting transcripts and extract actionable tasks.

For each task you identify, provide:
- A clear, actionable title (start with a verb)
- A brief description explaining what needs to be done
- Priority level based on urgency indicators in the content
- Suggested category/tag
- Estimated effort (if determinable)

Rules:
- Focus on concrete, actionable items (not vague requests)
- Identify deadlines mentioned in the content
- Recognize dependencies between tasks
- Prioritize based on urgency indicators (ASAP, urgent, deadline dates)
- Suggest who should own the task based on context

Return a JSON object with this structure:
{
  "suggestions": [
    {
      "id": 1,
      "title": "Task title starting with verb",
      "description": "Brief explanation of what needs to be done",
      "priority": "high" | "medium" | "low",
      "category": "development" | "design" | "review" | "meeting" | "documentation" | "other",
      "estimatedEffort": "1h" | "2h" | "4h" | "1d" | "2d" | "1w",
      "deadline": "YYYY-MM-DD or null if not specified",
      "assignee": "Suggested person or null",
      "reason": "Why this task was extracted"
    }
  ],
  "summary": "Brief summary of the overall content and tasks identified"
}`;

    const contextInfo = contentType === 'email' 
      ? `Email from: ${sender || 'Unknown'}\nSubject: ${subject || 'No subject'}\n\nContent:\n${content}`
      : `Meeting Transcript:\n${content}`;

    const userPrompt = `Analyze the following ${contentType} and extract actionable tasks:\n\n${contextInfo}\n\nIdentify all concrete tasks that should be tracked and completed. Be specific and actionable.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ error: "Failed to generate task suggestions" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      return new Response(JSON.stringify({ error: "No content in AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse JSON response
    let taskData;
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        taskData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      taskData = {
        suggestions: [
          {
            id: 1,
            title: "Review and respond",
            description: aiContent.substring(0, 150),
            priority: "medium",
            category: "other",
            estimatedEffort: "1h",
            deadline: null,
            assignee: null,
            reason: "Content analysis"
          }
        ],
        summary: "Tasks extracted from content"
      };
    }

    console.log("Successfully generated task suggestions for user:", user.id, "count:", taskData.suggestions?.length || 0);

    return new Response(JSON.stringify(taskData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in suggest-tasks function:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
