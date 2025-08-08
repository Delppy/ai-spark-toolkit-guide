import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: WelcomeEmailRequest = await req.json();
    
    console.log(`Sending welcome email to: ${email}`);

    const displayName = name || email.split('@')[0];

    const emailResponse = await resend.emails.send({
      from: "Delppy <delppy@aitouse.app>",
      to: [email],
      subject: "Welcome to AiTouse! 🚀",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to AiTouse</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; background-color: #f8fafc; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">
                Welcome to AiTouse! 🎉
              </h1>
              <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">
                Your AI-powered productivity journey starts here
              </p>
            </div>

            <!-- Main Content -->
            <div style="padding: 40px 30px;">
              <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                Hi ${displayName}! 👋
              </h2>
              
              <p style="color: #4a5568; margin: 0 0 20px 0; font-size: 16px;">
                Thank you for joining AiTouse! We're excited to have you on board. Our platform is designed to help you discover and leverage the best AI tools to supercharge your productivity.
              </p>

              <div style="background-color: #f7fafc; border-left: 4px solid #667eea; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
                <h3 style="color: #2d3748; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                  🚀 What you can do now:
                </h3>
                <ul style="color: #4a5568; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Explore our curated collection of AI tools</li>
                  <li style="margin-bottom: 8px;">Discover powerful prompt packs for various tasks</li>
                  <li style="margin-bottom: 8px;">Save your favorite tools and prompts</li>
                  <li style="margin-bottom: 8px;">Join our community of AI enthusiasts</li>
                </ul>
              </div>

              <div style="text-align: center; margin: 35px 0;">
                <a href="https://aitouse.app/tools" 
                   style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);">
                  Explore AI Tools →
                </a>
              </div>

              <p style="color: #4a5568; margin: 25px 0 0 0; font-size: 16px;">
                If you have any questions or need help getting started, feel free to reach out to us. We're here to help you make the most of AI!
              </p>
            </div>

            <!-- Footer -->
            <div style="background-color: #f7fafc; padding: 25px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #718096; margin: 0 0 10px 0; font-size: 14px;">
                Best regards,<br>
                <strong style="color: #4a5568;">The AiTouse Team</strong>
              </p>
              <p style="color: #a0aec0; margin: 0; font-size: 12px;">
                You're receiving this email because you signed up for AiTouse.
                <br>
                <a href="https://aitouse.app" style="color: #667eea; text-decoration: none;">Visit AiTouse</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      messageId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);