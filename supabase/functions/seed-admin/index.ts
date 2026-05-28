import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    const adminEmail = "admin@gmail.com";
    const adminPassword = "admin123";

    // Check if admin user exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const adminExists = existingUsers?.users?.find(
      (u) => u.email === adminEmail
    );

    if (adminExists) {
      // Update role to admin
      const { error: roleError } = await supabase
        .from("user_roles")
        .upsert(
          { user_id: adminExists.id, role: "admin" },
          { onConflict: "user_id" }
        );

      if (roleError) {
        return new Response(
          JSON.stringify({
            success: true,
            message: "Admin user already exists",
            email: adminEmail,
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "Admin user already exists",
          email: adminEmail,
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create admin user
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: {
        name: "Admin User",
      },
    });

    if (createError || !newUser) {
      throw new Error(createError?.message || "Failed to create admin user");
    }

    // Add admin role
    const { error: roleError } = await supabase.from("user_roles").insert({
      user_id: newUser.id,
      role: "admin",
    });

    if (roleError) {
      console.error("Error creating role:", roleError);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Admin user created successfully",
        email: adminEmail,
        password: adminPassword,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
