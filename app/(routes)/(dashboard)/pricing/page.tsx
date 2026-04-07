import React from "react";
import { Check } from "lucide-react";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for testing our AI capabilities.",
    features: ["5 AI consultations/month", "Standard response time", "Basic medical logic"],
    buttonText: "Current Plan",
    active: true
  },
  {
    name: "Pro",
    price: "$29",
    description: "Best for regular health tracking.",
    features: ["Unlimited AI consultations", "Priority response time", "Advanced medical insights", "PDF health reports"],
    buttonText: "Upgrade Now",
    active: false
  },
  {
    name: "Family",
    price: "$49",
    description: "Full care for your entire household.",
    features: ["Multi-user support", "Early access to features", "24/7 dedicated AI support", "Family health statistics"],
    buttonText: "Get Family Plan",
    active: false
  }
];

function PricingPage() {
  return (
    <div className="h-full overflow-y-auto p-4 md:p-8">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-black dark:text-white mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          Choose the plan that fits your health journey. No hidden fees, cancel anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto pb-12">
        {pricingPlans.map((plan, index) => (
          <div 
            key={index}
            className={`flex flex-col p-8 rounded-3xl backdrop-blur-xl border transition-all duration-300 ${
              plan.active 
                ? "bg-white/80 dark:bg-slate-800/80 border-blue-200 dark:border-blue-900 shadow-2xl scale-105 z-10" 
                : "bg-white/40 dark:bg-slate-900/40 border-white/40 dark:border-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60"
            }`}
          >
            <div className="mb-8">
              <h3 className="text-xl font-bold text-black dark:text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-extrabold text-black dark:text-white">{plan.price}</span>
                <span className="text-slate-500 dark:text-slate-400">/month</span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
            </div>

            <div className="space-y-4 mb-8 flex-1">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="p-1 rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <Check className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                </div>
              ))}
            </div>

            <button 
              className={`w-full py-3 rounded-2xl font-bold transition-all ${
                plan.active 
                  ? "bg-black text-white dark:bg-white dark:text-black hover:opacity-90 shadow-lg" 
                  : "bg-white/50 dark:bg-slate-800/50 text-black dark:text-white border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {plan.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingPage;
