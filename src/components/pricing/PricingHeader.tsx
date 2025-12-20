
import { Crown } from "lucide-react";

const PricingHeader = () => (
  <div className="mb-8 text-center">
    <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-3 flex items-center justify-center gap-2">
      <Crown className="w-8 h-8 text-primary inline-block" strokeWidth={1.5} />
      Choose Your Plan
    </h1>
    <p className="text-lg max-w-lg mx-auto text-muted-foreground">
      Start with our <span className="font-semibold text-primary">free plan</span> or upgrade to Pro for unlimited access to all premium features.
    </p>
  </div>
);

export default PricingHeader;