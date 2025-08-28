import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  name: string;
  email: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email }: WelcomeEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "AiToUse <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to AiToUse!",
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
              .feature-list {
                background: #f8f9fa;
                border-radius: 8px;
                padding: 20px;
                margin: 20px 0;
              }
              .feature-item {
                padding: 10px 0;
                border-bottom: 1px solid #e0e0e0;
              }
              .feature-item:last-child {
                border-bottom: none;
              }
              .footer {
                text-align: center;
                color: #666;
                font-size: 14px;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
              }
              .highlight {
                background: linear-gradient(135deg, #00597b 0%, #0099cc 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                font-weight: bold;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <div class="header">
                  <div class="logo">AiToUse</div>
                </div>
                
                <h1>Welcome to AiToUse, ${name}! 🎉</h1>
                
                <p>Thank you for joining AiToUse! We're thrilled to have you as part of our community.</p>
                
                <p><strong>Great news!</strong> All premium features are now <span class="highlight">completely free</span> for everyone. You have instant access to:</p>
                
                <div class="feature-list">
                  <div class="feature-item">✨ <strong>Unlimited AI Tools</strong> - Access our entire collection of AI tools</div>
                  <div class="feature-item">📚 <strong>Premium Prompt Packs</strong> - All professional prompts at your fingertips</div>
                  <div class="feature-item">🚀 <strong>Prompt Refinery</strong> - Generate refined prompts instantly</div>
                  <div class="feature-item">💾 <strong>Save Favorites</strong> - Organize your favorite tools and prompts</div>
                  <div class="feature-item">📊 <strong>Personal Dashboard</strong> - Track your usage and discover new tools</div>
                  <div class="feature-item">🎯 <strong>No Ads</strong> - Enjoy an ad-free experience</div>
                </div>
                
                <p>Ready to boost your productivity with AI? Start exploring now:</p>
                
                <div style="text-align: center;">
                  <a href="${req.headers.get('origin') || 'https://aitouse.com'}/dashboard" class="button">
                    Go to Your Dashboard
                  </a>
                </div>
                
                <p><strong>Quick Start Tips:</strong></p>
                <ul>
                  <li>Browse our <a href="${req.headers.get('origin') || 'https://aitouse.com'}/tools">AI Tools Directory</a> to find the perfect tools for your needs</li>
                  <li>Check out our <a href="${req.headers.get('origin') || 'https://aitouse.com'}/prompts">Prompt Library</a> for ready-to-use prompts</li>
                  <li>Use the <a href="${req.headers.get('origin') || 'https://aitouse.com'}/prompt-refinery">Prompt Refinery</a> to generate custom prompts</li>
                </ul>
                
                <div class="footer">
                  <p>If you have any questions or need help, feel free to <a href="${req.headers.get('origin') || 'https://aitouse.com'}/contact">contact us</a>.</p>
                  <p>Happy exploring!</p>
                  <p>The AiToUse Team</p>
                  <br>
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

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
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