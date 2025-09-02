
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, XCircle, Percent } from "lucide-react";

interface PlanCardProps {
  planType: "Free" | "Pro";
  billing: "monthly" | "yearly";
  price: string | React.ReactNode;
  features: string[];
  isCurrentPlan?: boolean;
  isPopular?: boolean;
  onUpgrade?: () => void;
  loading?: boolean;
  yearlyDiscountPercent?: number;
}

const PlanCard: React.FC<PlanCardProps> = ({
  planType,
  billing,
  price,
  features,
  isCurrentPlan = false,
  isPopular = false,
  onUpgrade,
  loading = false,
  yearlyDiscountPercent,
}) => {
  const isPro = planType === "Pro";

  return (
    <Card className={`w-full ${isPro ? "md:w-96 shadow-lg border-2 border-primary bg-card" : "md:w-80 border-2 border-border bg-card/70 shadow-sm"}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className={`text-xl ${isPro ? "text-2xl text-primary flex items-center" : ""}`}>
            {planType}
            {isCurrentPlan && !isPro && <Badge variant="outline" className="ml-2 text-accent border-accent">Current Plan</Badge>}
            {isPopular && (
              <Badge variant="premium" className="ml-2 text-xs font-semibold">
                Most Popular
              </Badge>
            )}
          </CardTitle>
        </div>
        <CardDescription>
          {isPro ? "Unlock unlimited access to all premium features" : "Perfect for getting started"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`mb-4 ${isPro ? 'flex items-center justify-center gap-2' : ''}`}>
          {price}
        </div>
        {isPro && (
          <>
            {billing === "yearly" && yearlyDiscountPercent && (
              <div className="mb-2 flex items-center justify-center gap-2">
                <Badge className="bg-accent/10 text-accent border-accent px-2 py-0.5 flex items-center gap-1">
                  <Percent className="w-3 h-3" />
                  Save {yearlyDiscountPercent}%
                </Badge>
              </div>
            )}
          </>
        )}
        <ul className="mb-6 space-y-2">
          {features.map((feature) => (
            <li className={`flex items-center gap-2 ${isPro ? 'text-base' : 'text-sm text-muted-foreground'}`} key={feature}>
              <Check className={`w-4 h-4 ${isPro ? 'w-5 h-5 text-primary' : 'text-accent'}`} /> {feature}
            </li>
          ))}
        </ul>
        {isPro ? (
          <>
            <Button
              className="w-full bg-gradient-to-r from-primary to-primary/80 text-primary-foreground text-lg font-bold py-6 shadow-lg"
              onClick={onUpgrade}
              disabled={loading || isCurrentPlan}
            >
              {loading ? "Processing..." : isCurrentPlan ? "Current Plan" : "Upgrade to Pro"}
            </Button>
            {!isCurrentPlan && (
              <p className="text-xs text-center text-muted-foreground mt-4">
                Secure payment via Paystack
              </p>
            )}
          </>
        ) : (
          <Button variant="outline" asChild className="w-full" disabled={isCurrentPlan}>
            <span>{isCurrentPlan ? "Current Plan" : "Get Started"}</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanCard;
