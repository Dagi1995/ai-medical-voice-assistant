"use client";

import { motion } from "motion/react";
import { Clock, Globe, Shield, Zap } from "lucide-react";
import Orb from "@/components/Orb";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const features = [
  { icon: Clock, title: "24/7 Availability", desc: "Our AI is always online, ready to assist you anytime without delays." },
  { icon: Globe, title: "Multilingual", desc: "Fluent in Amharic, English, and more languages for a comfortable patient experience." },
  { icon: Shield, title: "Secure & Private", desc: "Your medical data is encrypted and strictly confidential, meeting top standards." },
  { icon: Zap, title: "Instant Booking", desc: "Schedule appointments instantly with no waiting times or hold music." },
];

export function WhyUs() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";
  const orbBg = mounted ? (isDark ? "#0a0a0a" : "#f8fafc") : "#f8fafc";

  return (
    <section id="why-us" className="py-24 px-4 bg-slate-50 dark:bg-[#0a0a0a] relative overflow-hidden isolate">
      {/* Background Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] -z-10 opacity-70 dark:opacity-90 mix-blend-multiply dark:mix-blend-screen overflow-hidden">
        {mounted && (
          <Orb
            hue={0}
            hoverIntensity={2}
            rotateOnHover={true}
            forceHoverState={false}
            backgroundColor={orbBg}
          />
        )}
      </div>

      {/* Wrapping layer that ignores mouse commands so it drops through to the Orb underneath */}
      <div className="max-w-7xl mx-auto relative z-10 pointer-events-none">

        {/* Enable pointing events locally for the text headers ensuring they copy/select normally */}
        <div className="text-center mb-16 pointer-events-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 drop-shadow-sm">
            Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-500 font-extrabold pb-2">MediAI?</span>
          </h2>
          <p className="text-lg text-slate-600 font-medium dark:text-slate-400 max-w-2xl mx-auto drop-shadow-sm">
            Next-generation healthcare assistance designed for unparalleled convenience, accessibility, and accuracy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                // We enable pointing locally here so hover effects and clicks on the grid cards still function normally.
                className="group p-8 rounded-3xl bg-white/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-2xl hover:-translate-y-3 hover:border-blue-500/40 dark:hover:border-blue-400/40 transition-all duration-300 ease-out backdrop-blur-xl pointer-events-auto"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{f.title}</h3>
                <p className="text-slate-600 font-medium dark:text-slate-300 leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
