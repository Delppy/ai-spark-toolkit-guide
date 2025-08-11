
import { Sparkles } from "lucide-react";

const PricingHeader = () => (
  <div className="mb-8 text-center">
    <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text mb-3 flex items-center justify-center gap-2">
      <Sparkles className="w-8 h-8 text-accent inline-block" strokeWidth={1.5} />
      Get Pro Access
    </h1>
    <p className="text-lg max-w-lg mx-auto text-muted-foreground">
      Upgrade to <span className="font-semibold text-primary">Pro</span> and supercharge your productivity! Unlimited prompt packs, premium tools, and more.
    </p>
  </div>
);

export default PricingHeader;
