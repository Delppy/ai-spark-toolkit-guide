
import { Button } from "@/components/ui/button";
import { Facebook, Linkedin } from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import React from "react";

// Get env vars from Lovable's Supabase integration.
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Google SVG icon as a React component
const GoogleIcon = (props: React.ComponentProps<"svg">) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" {...props}>
    <g>
      <path fill="#4285F4" d="M21.82 12.24c0-.7-.06-1.38-.17-2.03H12v3.84h5.56a4.74 4.74 0 01-2.06 3.11v2.58h3.34c1.95-1.8 3.08-4.46 3.08-7.5z"/>
      <path fill="#34A853" d="M12 22c2.79 0 5.13-.92 6.84-2.49l-3.34-2.58a6.23 6.23 0 01-3.5 1.03c-2.7 0-4.99-1.82-5.8-4.26H3.66v2.66A10 10 0 0012 22z"/>
      <path fill="#FBBC05" d="M6.2 13.7A5.99 5.99 0 016 12c0-.59.1-1.15.17-1.7V7.63H3.66A9.97 9.97 0 002 12c0 1.58.38 3.07 1.05 4.37l3.15-2.67z"/>
      <path fill="#EA4335" d="M12 6.24c1.54 0 2.92.53 4.01 1.57l3-3A9.86 9.86 0 0012 2a10 10 0 00-8.34 5.63l3.15 2.66C7.01 7.93 9.22 6.24 12 6.24z"/>
    </g>
  </svg>
);

const providers = [
  {
    name: "Google",
    icon: GoogleIcon,
    color: "bg-white border hover:bg-gray-100 text-gray-900",
    key: "google",
  },
  {
    name: "Facebook",
    icon: Facebook,
    color: "bg-[#1877F2] hover:bg-[#145acc] text-white",
    key: "facebook",
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    color: "bg-[#0A66C2] hover:bg-[#09549b] text-white",
    key: "linkedin",
  },
];

const SocialAuthButtons = () => {
  const handleSocial = async (provider: string) => {
    await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  return (
    <div className="flex flex-col gap-3 mb-8">
      {providers.map((provider) => {
        const Icon = provider.icon;
        return (
          <Button
            type="button"
            key={provider.key}
            className={`w-full flex items-center gap-2 justify-center font-semibold text-base ${provider.color}`}
            onClick={() => handleSocial(provider.key)}
          >
            <Icon className="w-5 h-5" />
            Continue with {provider.name}
          </Button>
        );
      })}
      <div className="flex items-center my-2">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="mx-2 text-slate-400 text-sm">or</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>
    </div>
  );
};

export default SocialAuthButtons;

