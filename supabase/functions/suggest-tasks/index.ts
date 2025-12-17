import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content, contentType, sender, subject } = await req.json();

    console.log("Generating task suggestions for:", contentType, subject || "");

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
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
      ? `Email from: ${sender}\nSubject: ${subject}\n\nContent:\n${content}`
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
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error("No content in AI response");
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

    console.log("Successfully generated task suggestions:", taskData.suggestions?.length || 0);

    return new Response(JSON.stringify(taskData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in suggest-tasks function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
