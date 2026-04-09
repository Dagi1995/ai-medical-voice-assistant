import { toast, Toaster } from "sonner";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import SoftAurora from "@/components/SoftAurora";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-48 px-4 overflow-hidden min-h-[90vh] flex flex-col items-center justify-center isolate">
      {/* Background Aurora */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <Toaster position="top-right" />
        import SoftAurora from './SoftAurora';
        <SoftAurora
          speed={1.6}
          scale={1.5}
          brightness={1.1}
          color1="#f7f7f7"
          color2="#e100ff"
          noiseFrequency={4}
          noiseAmplitude={3}
          bandHeight={0.5}
          bandSpread={1}
          octaveDecay={0.1}
          layerOffset={0.2}
          colorSpeed={1}
          enableMouseInteraction
          mouseInfluence={0.35}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] text-slate-900 dark:text-white"
          >
            Transform Your{" "}
            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pb-2">
              Health with AI Agent
            </span>
          </motion.h1>

          <p className="mt-12 text-lg text-slate-700 font-medium dark:text-slate-200">
            Speak naturally. Our AI listens, understands, and schedules
            appointments automatically — 24/7.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/sign-in">
              <Button
                onClick={() => {
                  toast("Welcome to MedAI🚀");
                  // setTimeout(() => {
                  //   router.push("/sign-in");
                  // }, 800);
                }}
                className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full border-0 shadow-lg cursor-pointer tracking-wide font-medium"
              >
                Get Started
              </Button>
            </Link>
            <Link href="#demo">
              <Button
                variant="outline"
                className="h-14 px-8 text-lg rounded-full shadow-lg dark:text-white dark:border-white/20 dark:bg-black/50 backdrop-blur-md cursor-pointer tracking-wide font-medium"
              >
                Watch Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
