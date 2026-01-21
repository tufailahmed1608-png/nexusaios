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

    // ============ SECURITY: Require admin authentication ============
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
      );
    }

    // Check if user has admin role
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (roleError || roleData?.role !== "admin") {
      console.error(`Unauthorized access attempt by user ${user.id}`);
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin role required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }
    // ============ END SECURITY CHECK ============

    // Get password from environment or request body
    let password: string;
    try {
      const body = await req.json();
      password = body.password || Deno.env.get("TEST_USERS_PASSWORD");
    } catch {
      password = Deno.env.get("TEST_USERS_PASSWORD") || "";
    }

    if (!password || password.length < 8) {
      return new Response(
        JSON.stringify({ error: "Password must be provided and at least 8 characters" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

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
      const { error: insertRoleError } = await supabaseAdmin
        .from("user_roles")
        .insert({ user_id: userData.user.id, role: testUser.role });

      if (insertRoleError) {
        results.push({ email: testUser.email, status: "partial", message: `User created but role failed: ${insertRoleError.message}` });
      } else {
        results.push({ email: testUser.email, role: testUser.role, status: "success" });
      }
    }

    console.log(`Admin ${user.id} created test users:`, results);

    return new Response(JSON.stringify({ results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in create-test-users:", message);
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
