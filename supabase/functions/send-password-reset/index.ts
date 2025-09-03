import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";
import { Resend } from "npm:resend@2.0.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resendFromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "AiToUse <onboarding@resend.dev>";

console.log("Initializing send-password-reset function v2...");
console.log("Resend API Key present:", !!resendApiKey);

const supabase = createClient(supabaseUrl, supabaseServiceKey);
// Resend client is initialized inside the handler after validating the API key

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email }: PasswordResetRequest = await req.json();
    
    console.log("Processing password reset for:", email);
    
    // Generate password reset link using Supabase Admin API
    const origin = req.headers.get('origin') || req.headers.get('referer')?.split('/').slice(0, 3).join('/') || 'https://b39cd442-a691-46a7-b62b-faf8c346904d.lovableproject.com';
    console.log("Using origin for redirect:", origin);
    
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${origin}/reset-password`,
      }
    });
    
    if (linkError) {
      console.error("Error generating reset link:", linkError);
      const msg = (linkError as any)?.message?.toLowerCase?.() || String(linkError.message || linkError);
      if (msg.includes('user') && msg.includes('not')) {
        // Neutral response to prevent user enumeration
        return new Response(
          JSON.stringify({ success: true, message: "If an account exists, a reset email has been sent." }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      return new Response(
        JSON.stringify({ error: linkError.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    
    if (!linkData || !linkData.properties?.action_link) {
      console.error("No reset link generated");
      return new Response(
        JSON.stringify({ error: "Failed to generate reset link" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    
    const resetLink = linkData.properties.action_link;
    console.log("Reset link generated successfully");
    console.log("Attempting to send email with Resend...");
    
    if (!resendApiKey) {
      console.error("RESEND_API_KEY is not configured - falling back to Supabase auth recovery");
      // Fallback to Supabase's built-in recovery email
      const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/reset-password`,
      });
      
      if (recoveryError) {
        console.error("Supabase recovery error:", recoveryError);
        return new Response(
          JSON.stringify({ error: "Failed to send reset email" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      
      console.log("Fallback recovery email sent via Supabase");
      return new Response(
        JSON.stringify({ success: true, message: "Reset email sent via Supabase" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const resend = new Resend(resendApiKey);
    console.log("Resend initialized with key:", resendApiKey.substring(0, 8) + "******");
    
    try {
      const emailResponse = await resend.emails.send({
        from: resendFromEmail,
        to: [email],
        subject: "Reset Your Password - AiToUse",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body {
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  margin: 0;
                  padding: 0;
                  background-color: #f7f7f7;
                }
                .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                }
                .card {
                  background: white;
                  border-radius: 12px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                  padding: 40px;
                  margin: 20px 0;
                }
                .header {
                  text-align: center;
                  margin-bottom: 30px;
                }
                .logo {
                  display: inline-block;
                  padding: 10px 20px;
                  background: linear-gradient(135deg, #00597b 0%, #0099cc 100%);
                  color: white;
                  border-radius: 8px;
                  font-size: 24px;
                  font-weight: bold;
                  text-decoration: none;
                }
                h1 {
                  color: #00597b;
                  font-size: 28px;
                  margin: 20px 0;
                }
                .button {
                  display: inline-block;
                  padding: 14px 32px;
                  background: linear-gradient(135deg, #00597b 0%, #0099cc 100%);
                  color: white !important;
                  text-decoration: none;
                  border-radius: 8px;
                  font-weight: 600;
                  font-size: 16px;
                  margin: 20px 0;
                }
                .warning {
                  background: #fff3cd;
                  border: 1px solid #ffc107;
                  border-radius: 8px;
                  padding: 15px;
                  margin: 20px 0;
                  color: #856404;
                }
                .footer {
                  text-align: center;
                  color: #666;
                  font-size: 14px;
                  margin-top: 30px;
                  padding-top: 20px;
                  border-top: 1px solid #e0e0e0;
                }
                .link-text {
                  word-break: break-all;
                  color: #0099cc;
                  font-size: 12px;
                  margin: 10px 0;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="card">
                  <div class="header">
                    <div class="logo">AiToUse</div>
                  </div>
                  
                  <h1>Reset Your Password</h1>
                  
                  <p>Hi there,</p>
                  
                  <p>We received a request to reset your password for your AiToUse account. Click the button below to create a new password:</p>
                  
                  <div style="text-align: center;">
                    <a href="${resetLink}" class="button">
                      Reset Password
                    </a>
                  </div>
                  
                  <p style="color: #666; font-size: 14px;">Or copy and paste this link into your browser:</p>
                  <p class="link-text">${resetLink}</p>
                  
                  <div class="warning">
                    <strong>⚠️ Important:</strong> This password reset link will expire in 1 hour for security reasons. If you didn't request this password reset, you can safely ignore this email.
                  </div>
                  
                  <div class="footer">
                     <p>Need help? <a href="${origin}/contact" style="color: #0099cc;">Contact our support team</a></p>
                     <p style="font-size: 12px; color: #999;">
                       © 2024 AiToUse. All rights reserved.<br>
                       <a href="${origin}/privacy-policy" style="color: #999;">Privacy Policy</a>
                     </p>
                  </div>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      console.log("Email sent successfully:", emailResponse);

      return new Response(JSON.stringify({ success: true, data: emailResponse }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    } catch (emailError: any) {
      console.error("Resend email error details:", emailError);
      console.log("Falling back to Supabase auth recovery due to Resend error");
      
      // Fallback to Supabase's built-in recovery email if Resend fails
      try {
        const { error: recoveryError } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${origin}/reset-password`,
        });
        
        if (recoveryError) {
          console.error("Supabase recovery fallback also failed:", recoveryError);
          return new Response(
            JSON.stringify({ error: "Failed to send reset email" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        
        console.log("Fallback recovery email sent successfully via Supabase");
        return new Response(
          JSON.stringify({ success: true, message: "Reset email sent via fallback" }),
          { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      } catch (fallbackError) {
        console.error("Complete failure - both Resend and Supabase failed:", fallbackError);
        return new Response(
          JSON.stringify({ error: "Email service unavailable" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }
  } catch (error: any) {
    console.error("Error in send-password-reset function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);