import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectName, riskScore, delayProbability, predictedDelay, riskFactors, trend } = await req.json();

    console.log("Generating risk mitigation for:", projectName);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert project risk analyst and mitigation strategist. Your role is to analyze project risk data and provide specific, actionable recommendations to reduce project delays and mitigate risks.

Your recommendations should be:
- Specific and actionable (not generic advice)
- Prioritized by impact
- Include estimated time to implement
- Consider resource constraints
- Include early warning signs to monitor

Format your response as a JSON object with the following structure:
{
  "summary": "Brief 1-2 sentence summary of the risk situation",
  "recommendations": [
    {
      "id": 1,
      "title": "Short title",
      "description": "Detailed description of the action",
      "priority": "critical" | "high" | "medium" | "low",
      "impact": "Expected impact on reducing delay",
      "timeToImplement": "Estimated time to implement",
      "resources": "Resources needed"
    }
  ],
  "warningSignsToMonitor": ["sign1", "sign2"],
  "estimatedDelayReduction": "X days if all recommendations implemented"
}`;

    const userPrompt = `Analyze the following project risk data and provide specific mitigation recommendations:

Project: ${projectName}
Current Risk Score: ${riskScore}/100
Delay Probability: ${delayProbability}%
Predicted Delay: ${predictedDelay} days
Risk Trend: ${trend}

Risk Factors:
${riskFactors.map((f: any) => `- ${f.name}: Score ${f.score}/100 (Impact: ${f.impact})`).join('\n')}

Based on this data, provide specific, actionable recommendations to reduce the project delay and mitigate the identified risks. Focus especially on the high-impact risk factors.`;

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
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    let mitigationData;
    try {
      // Extract JSON from the response (in case there's markdown formatting)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        mitigationData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      // Return a structured fallback
      mitigationData = {
        summary: "Risk analysis completed. Please review the recommendations below.",
        recommendations: [
          {
            id: 1,
            title: "Review Resource Allocation",
            description: content.substring(0, 200),
            priority: "high",
            impact: "May reduce delays",
            timeToImplement: "1-2 weeks",
            resources: "Project manager review required"
          }
        ],
        warningSignsToMonitor: ["Track progress weekly", "Monitor team capacity"],
        estimatedDelayReduction: "TBD based on implementation"
      };
    }

    console.log("Successfully generated mitigation recommendations");

    return new Response(JSON.stringify(mitigationData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-risk-mitigation function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
