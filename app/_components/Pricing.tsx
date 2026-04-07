import ElectricBorder from "@/components/ElectricBorder";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

type PlanType = {
  name: string;
  price: string;
  features: string[];
  isPopular?: boolean;
  button: string;
};

export function Pricing() {
  const plans: PlanType[] = [
    {
      name: "Free",
      price: "$0",
      features: ["5 AI consultations/mo", "Basic Symptom Checking", "Email Support", "Secure History"],
      button: "Get Started for Free",
    },
    {
      name: "Pro",
      price: "$29",
      features: ["Unlimited Consultations", "Priority Booking", "Voice Journey Analysis", "24/7 Priority Support"],
      isPopular: true,
      button: "Upgrade to Pro",
    },
  ];

  return (
    <section id="pricing" className="py-24 px-4 bg-white dark:bg-[#0a0a0a] border-t border-slate-100 dark:border-white/5 py-32 z-10 relative">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 drop-shadow-sm">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-slate-600 font-medium dark:text-slate-400 max-w-2xl mx-auto drop-shadow-sm">
            Choose the plan that best fits your medical needs. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className="relative flex flex-col h-full rounded-3xl min-h-[480px]">
              {plan.isPopular ? (
                //@ts-ignore
                <ElectricBorder color="#ec4899" speed={1.5} borderRadius={24} className="h-full flex-1">
                  <PricingCardContent plan={plan} />
                </ElectricBorder>
              ) : (
                <div className="h-full p-[1px] rounded-[24px] bg-gradient-to-b from-slate-200 to-slate-100 dark:from-white/10 dark:to-transparent flex-1 shadow-lg">
                  <PricingCardContent plan={plan} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingCardContent({ plan }: { plan: PlanType }) {
  return (
    <div className={`p-10 bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[23px] h-full flex flex-col relative z-10 ${plan.isPopular ? '' : 'shadow-xl'}`}>
      {plan.isPopular && (
        <span className="absolute top-0 right-8 -translate-y-1/2 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-pink-500 text-white shadow-[0_0_20px_rgba(236,72,153,0.3)]">
          Most Popular
        </span>
      )}
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{plan.name}</h3>
      <div className="mt-4 flex items-end gap-2 mb-8">
        <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tight">{plan.price}</span>
        <span className="text-slate-500 font-medium mb-2">/month</span>
      </div>
      <ul className="space-y-5 flex-1 pt-4 border-t border-slate-200 dark:border-slate-800">
        {plan.features.map((f: string, j: number) => (
          <li key={j} className="flex items-start gap-3 text-slate-800 font-medium dark:text-slate-300">
            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span className="text-[15px]">{f}</span>
          </li>
        ))}
      </ul>
      <Button 
        className={`mt-10 w-full rounded-full h-14 text-md font-bold transition-all tracking-wide ${
          plan.isPopular 
            ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white hover:shadow-lg hover:-translate-y-0.5 border-0 hover:opacity-95" 
            : "bg-slate-200/50 hover:bg-slate-300/50 text-slate-900 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white"
        }`}
      >
        {plan.button}
      </Button>
    </div>
  );
}
