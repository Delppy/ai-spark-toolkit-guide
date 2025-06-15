
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, XCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const proFeatures = [
  "Unlock all prompt packs",
  "Unlimited use of Pro tools",
  "Priority support",
  "Early access to updates",
  "Access to new features first",
];

const freeFeatures = [
  "Access to all free tools",
  "Limited prompt packs",
  "No credit card required",
];

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col items-center justify-start py-10 px-2">
      <div className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-700 to-pink-600 text-transparent bg-clip-text mb-3 flex items-center justify-center gap-2">
          <Sparkles className="w-8 h-8 text-amber-400 inline-block" strokeWidth={1.5} />
          Get Pro Access
        </h1>
        <p className="text-lg max-w-lg mx-auto text-slate-700">
          Upgrade to <span className="font-semibold text-purple-700">Pro</span> and supercharge your productivity! Unlimited prompt packs, premium tools, and more.
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-5xl">

        {/* Free Plan */}
        <Card className="w-full md:w-80 border-2 border-gray-200 bg-white/70 shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">Free</CardTitle>
              <Badge variant="outline" className="text-green-600 border-green-400">Current Plan</Badge>
            </div>
            <CardDescription>All the basics, free forever!</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold mb-4">$0<span className="text-base font-normal text-gray-400">/month</span></p>
            <ul className="mb-4 space-y-2">
              {freeFeatures.map((feature) => (
                <li className="flex items-center gap-2 text-sm text-slate-700" key={feature}>
                  <Check className="w-4 h-4 text-green-600" /> {feature}
                </li>
              ))}
              <li className="flex items-center gap-2 text-sm text-slate-400 line-through">
                <XCircle className="w-4 h-4" /> Unlock Pro packs
              </li>
            </ul>
            <Button variant="outline" asChild className="w-full" disabled>
              <span>Current Plan</span>
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="w-full md:w-96 shadow-lg border-2 border-purple-400 bg-white/90">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl text-purple-700 flex items-center">
                Pro
                <Badge className="ml-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-xs font-semibold">
                  Most Popular
                </Badge>
              </CardTitle>
            </div>
            <CardDescription>For students & power users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-extrabold mb-2">$9<span className="text-lg font-normal text-gray-400">/month</span></p>
            <span className="inline-block mb-4 text-purple-700 font-semibold">Cancel anytime</span>
            <ul className="mb-6 space-y-2">
              {proFeatures.map((feature) => (
                <li className="flex items-center gap-2 text-base" key={feature}>
                  <Check className="w-5 h-5 text-purple-700" /> {feature}
                </li>
              ))}
            </ul>
            {/* Placeholder for payment or sign-in/upgrade */}
            <Button className="w-full bg-gradient-to-r from-purple-600 to-amber-500 text-white text-lg font-bold py-6 shadow-lg">
              Get Pro Now
            </Button>
            <p className="text-xs text-center text-slate-500 mt-4">
              No Stripe setup yet. This is a demo UI only.
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-10">
        <Link to="/">
          <Button variant="ghost" className="text-blue-600 underline">← Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default Pricing;
