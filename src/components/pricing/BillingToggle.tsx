
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Percent } from "lucide-react";

interface BillingToggleProps {
  billing: "monthly" | "yearly";
  setBilling: (billing: "monthly" | "yearly") => void;
  yearlyDiscountPercent: number;
}

const BillingToggle = ({ billing, setBilling, yearlyDiscountPercent }: BillingToggleProps) => (
  <div className="flex items-center justify-center gap-3 mb-6 bg-card rounded-full p-1 border shadow-sm">
    <Button
      variant={billing === "monthly" ? "default" : "ghost"}
      className={`rounded-full px-6 py-2 ${billing === "monthly" ? "font-bold" : ""}`}
      onClick={() => setBilling("monthly")}
    >
      Monthly
    </Button>
    <Button
      variant={billing === "yearly" ? "default" : "ghost"}
      className={`rounded-full px-6 py-2 ${billing === "yearly" ? "font-bold" : ""}`}
      onClick={() => setBilling("yearly")}
    >
      Yearly
      <Badge className="ml-2 bg-accent/10 text-accent border-accent px-2 py-0.5 flex items-center gap-1">
        <Percent className="w-3 h-3" />
        Save {yearlyDiscountPercent}%
      </Badge>
    </Button>
  </div>
);

export default BillingToggle;
