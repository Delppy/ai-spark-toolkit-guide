import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  resetLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetLink }: PasswordResetRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "AiToUse <onboarding@resend.dev>",
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
                  <p>Need help? <a href="${req.headers.get('origin') || 'https://aitouse.com'}/contact" style="color: #0099cc;">Contact our support team</a></p>
                  <p style="font-size: 12px; color: #999;">
                    © 2024 AiToUse. All rights reserved.<br>
                    <a href="${req.headers.get('origin') || 'https://aitouse.com'}/privacy-policy" style="color: #999;">Privacy Policy</a>
                  </p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Password reset email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
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