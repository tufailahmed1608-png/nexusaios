import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Input validation constants
const MAX_PROJECT_NAME_LENGTH = 200;
const MAX_RISK_FACTORS = 50;
const MAX_RISK_FACTOR_NAME_LENGTH = 200;

interface RiskFactor {
  name: string;
  score: number;
  impact: string;
}

interface ValidatedInput {
  projectName: string;
  riskScore: number;
  delayProbability: number;
  predictedDelay: number;
  riskFactors: RiskFactor[];
  trend: string;
}

function validateInput(body: unknown): { valid: boolean; error?: string; data?: ValidatedInput } {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: "Invalid request body" };
  }

  const { projectName, riskScore, delayProbability, predictedDelay, riskFactors, trend } = body as Record<string, unknown>;

  if (typeof projectName !== 'string' || projectName.length === 0) {
    return { valid: false, error: "projectName is required" };
  }
  if (projectName.length > MAX_PROJECT_NAME_LENGTH) {
    return { valid: false, error: `projectName must be less than ${MAX_PROJECT_NAME_LENGTH} characters` };
  }

  if (typeof riskScore !== 'number' || riskScore < 0 || riskScore > 100) {
    return { valid: false, error: "riskScore must be a number between 0 and 100" };
  }

  if (typeof delayProbability !== 'number' || delayProbability < 0 || delayProbability > 100) {
    return { valid: false, error: "delayProbability must be a number between 0 and 100" };
  }

  if (typeof predictedDelay !== 'number' || predictedDelay < 0) {
    return { valid: false, error: "predictedDelay must be a non-negative number" };
  }

  if (!Array.isArray(riskFactors)) {
    return { valid: false, error: "riskFactors must be an array" };
  }
  if (riskFactors.length > MAX_RISK_FACTORS) {
    return { valid: false, error: `Maximum ${MAX_RISK_FACTORS} risk factors allowed` };
  }

  const validatedFactors: RiskFactor[] = [];
  for (let i = 0; i < riskFactors.length; i++) {
    const factor = riskFactors[i];
    if (!factor || typeof factor !== 'object') {
      return { valid: false, error: `Invalid risk factor at index ${i}` };
    }
    if (typeof factor.name !== 'string' || factor.name.length === 0) {
      return { valid: false, error: `Risk factor name is required at index ${i}` };
    }
    if (factor.name.length > MAX_RISK_FACTOR_NAME_LENGTH) {
      return { valid: false, error: `Risk factor name at index ${i} exceeds ${MAX_RISK_FACTOR_NAME_LENGTH} characters` };
    }
    if (typeof factor.score !== 'number' || factor.score < 0 || factor.score > 100) {
      return { valid: false, error: `Risk factor score at index ${i} must be between 0 and 100` };
    }
    if (typeof factor.impact !== 'string') {
      return { valid: false, error: `Risk factor impact is required at index ${i}` };
    }
    validatedFactors.push({
      name: factor.name.trim(),
      score: factor.score,
      impact: factor.impact.trim(),
    });
  }

  if (typeof trend !== 'string') {
    return { valid: false, error: "trend is required" };
  }

  return {
    valid: true,
    data: {
      projectName: projectName.trim(),
      riskScore,
      delayProbability,
      predictedDelay,
      riskFactors: validatedFactors,
      trend: trend.trim(),
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

    const { projectName, riskScore, delayProbability, predictedDelay, riskFactors, trend } = validation.data!;

    console.log("Generating risk mitigation for:", projectName, "user:", user.id);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      return new Response(JSON.stringify({ error: "Service configuration error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
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
${riskFactors.map((f) => `- ${f.name}: Score ${f.score}/100 (Impact: ${f.impact})`).join('\n')}

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
      return new Response(JSON.stringify({ error: "Failed to generate recommendations" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return new Response(JSON.stringify({ error: "No content in AI response" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse the JSON response
    let mitigationData;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        mitigationData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
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

    console.log("Successfully generated mitigation recommendations for user:", user.id);

    return new Response(JSON.stringify(mitigationData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in generate-risk-mitigation function:", error);
    return new Response(JSON.stringify({ error: "An unexpected error occurred" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
