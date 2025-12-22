import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const testUsers = [
  { email: "pm@nexusaios.com", role: "project_manager" },
  { email: "spm@nexusaios.com", role: "senior_project_manager" },
  { email: "pgm@nexusaios.com", role: "program_manager" },
  { email: "pmo@nexusaios.com", role: "pmo" },
  { email: "exc@nexusaios.com", role: "executive" },
  { email: "admin@nexusaios.com", role: "admin" },
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const password = "Jan@2026*";
    const results = [];

    for (const testUser of testUsers) {
      // Create user
      const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email: testUser.email,
        password: password,
        email_confirm: true,
      });

      if (createError) {
        results.push({ email: testUser.email, status: "error", message: createError.message });
        continue;
      }

      // Assign role
      const { error: roleError } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userData.user.id, role: testUser.role });

      if (roleError) {
        results.push({ email: testUser.email, status: "partial", message: `User created but role failed: ${roleError.message}` });
      } else {
        results.push({ email: testUser.email, role: testUser.role, status: "success" });
      }
    }

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
