
import { Sparkles } from "lucide-react";

const PricingHeader = () => (
  <div className="mb-8 text-center">
    <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-primary/60 text-transparent bg-clip-text mb-3 flex items-center justify-center gap-2">
      <Sparkles className="w-8 h-8 text-accent inline-block" strokeWidth={1.5} />
      All Features Are Free!
    </h1>
    <p className="text-lg max-w-lg mx-auto text-muted-foreground">
      Enjoy <span className="font-semibold text-primary">unlimited access</span> to all features completely free! No payment required.
    </p>
  </div>
);

export default PricingHeader;
