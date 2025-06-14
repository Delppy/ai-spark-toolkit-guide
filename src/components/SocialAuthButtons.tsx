
import { Button } from "@/components/ui/button";
import { facebook, google, linkedin } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

// Get env vars from Lovable's Supabase integration.
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const providers = [
  {
    name: "Google",
    icon: google,
    color: "bg-white border hover:bg-gray-100 text-gray-900",
    key: "google",
  },
  {
    name: "Facebook",
    icon: facebook,
    color: "bg-[#1877F2] hover:bg-[#145acc] text-white",
    key: "facebook",
  },
  {
    name: "LinkedIn",
    icon: linkedin,
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
      {providers.map((provider) => (
        <Button
          type="button"
          key={provider.key}
          className={`w-full flex items-center gap-2 justify-center font-semibold text-base ${provider.color}`}
          onClick={() => handleSocial(provider.key)}
        >
          <provider.icon className="w-5 h-5" />
          Continue with {provider.name}
        </Button>
      ))}
      <div className="flex items-center my-2">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="mx-2 text-slate-400 text-sm">or</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>
    </div>
  );
};

export default SocialAuthButtons;
