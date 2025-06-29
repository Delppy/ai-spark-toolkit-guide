
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
    <Card className={`w-full ${isPro ? "md:w-96 shadow-lg border-2 border-purple-400 bg-white/90" : "md:w-80 border-2 border-gray-200 bg-white/70 shadow-sm"}`}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className={`text-xl ${isPro ? "text-2xl text-purple-700 flex items-center" : ""}`}>
            {planType}
            {isCurrentPlan && !isPro && <Badge variant="outline" className="ml-2 text-green-600 border-green-400">Current Plan</Badge>}
            {isPopular && (
              <Badge className="ml-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold">
                Most Popular
              </Badge>
            )}
          </CardTitle>
        </div>
        <CardDescription>
          {isPro ? "Remove ads & unlock premium tools" : "All the basics, free forever!"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`mb-4 ${isPro ? 'flex items-center justify-center gap-2' : ''}`}>
          {price}
        </div>
        {isPro && (
          <>
            <span className="inline-block mb-4 text-purple-700 font-semibold text-center w-full">
              {billing === "yearly" ? "Best value – billed once a year" : "Cancel anytime"}
            </span>
            {billing === "yearly" && yearlyDiscountPercent && (
              <div className="mb-2 flex items-center justify-center gap-2">
                <Badge className="bg-amber-100 text-amber-700 border-amber-300 px-2 py-0.5 flex items-center gap-1">
                  <Percent className="w-3 h-3" />
                  Save {yearlyDiscountPercent}% compared to monthly
                </Badge>
              </div>
            )}
          </>
        )}
        <ul className="mb-6 space-y-2">
          {features.map((feature) => (
            <li className={`flex items-center gap-2 ${isPro ? 'text-base' : 'text-sm text-slate-700'}`} key={feature}>
              <Check className={`w-4 h-4 ${isPro ? 'w-5 h-5 text-purple-700' : 'text-green-600'}`} /> {feature}
            </li>
          ))}
          {!isPro && (
            <li className="flex items-center gap-2 text-sm text-slate-400 line-through">
              <XCircle className="w-4 h-4" /> Remove ads & premium tools
            </li>
          )}
        </ul>
        {isPro ? (
          <>
            <Button
              className="w-full bg-gradient-to-r from-purple-600 to-amber-500 text-white text-lg font-bold py-6 shadow-lg"
              onClick={onUpgrade}
              disabled={loading}
            >
              {loading
                ? "Redirecting to payment..."
                : billing === "yearly"
                ? "Get Pro Yearly"
                : "Get Pro Monthly"}
            </Button>
            <p className="text-xs text-center text-slate-500 mt-4">
              Payments processed securely by Paystack.
            </p>
          </>
        ) : (
          <Button variant="outline" asChild className="w-full" disabled>
            <span>Current Plan</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PlanCard;
