"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/button";
import { MedicalVoiceAgentDemo } from "./_components/Feature3dGrid";
import PharmacyFinder from "@/components/pharmacy-finder";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ModeToggle } from "@/app/(routes)/(dashboard)/_components/DarkMood";

import { HeroSection } from "./_components/HeroSection";
import { AdsStrip } from "./_components/AdsStrip";
import { WhyUs } from "./_components/WhyUs";
import { Pricing } from "./_components/Pricing";
import { Footer } from "./_components/Footer";


export default function Home() {
  const { scrollY } = useScroll();
  const navbarOpacity = useTransform(scrollY, [0, 80], [0.75, 0.95]);

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-[#0a0a0a] overflow-x-hidden selection:bg-purple-500/30">
      
      

      <div className="relative z-10 w-full h-full text-slate-900 dark:text-white">
        <Navbar opacity={navbarOpacity} />

        <HeroSection />
        <AdsStrip />
        
        
        <motion.section
          id="demo"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ amount: 0.3 }}
          className="py-24 relative bg-white dark:bg-[#0a0a0a]"
        >
          <MedicalVoiceAgentDemo />
        </motion.section>

          {/* fade out bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:via-black/40 dark:to-black" />
        </div>

        {/* HERO GLOW */}
        <div className="absolute left-1/2 top-48 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto">
          {/* CENTER CONTENT */}
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            {/* TITLE + IMAGE */}
            <div className="relative mt-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] text-slate-900 dark:text-white"
              >
                Transform Your{" "}
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Health with AI Agent
                </span>
              </motion.h1>

              {/* IMAGE */}
              <div className="relative mx-auto max-w-xl -mt-16">
                <Image
                  src="/robot1.png"
                  alt="AI Health Agent"
                  width={500}
                  height={620}
                  priority
                  className="w-full h-auto object-cover"
                />

                {/* bottom soft fade */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-28
                  bg-gradient-to-t from-white via-white/80 to-transparent
                  dark:from-black dark:via-black/80"
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-8 text-lg text-slate-600 dark:text-slate-300">
              Speak naturally. Our AI listens, understands, and schedules
              appointments automatically — 24/7.
            </p>

            {/* CTA */}
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/sign-in">
                <Button className="h-14 px-8 text-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  Get Started
                </Button>
              </Link>

              <Link href="/demo">
                <Button variant="outline" className="h-14 px-8 text-lg">
                  Watch Demo
                </Button>
              </Link>
            </div>
          </div>
          {/* LEFT FEATURE CARD — CLIPPED CARD ONLY */}
          <div className="hidden lg:block absolute left-0 top-2/5 -translate-y-1/2">
            <div className="relative w-[460px] h-[260px] flex items-end gap-0 isolate">
              {/* LEFT SMALL */}
              <div
                className="
        h-[220px] w-[110px]
        rounded-3xl
        bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20
        backdrop-blur-xl
        border border-white/10
        shadow-xl
        relative
        -top-2
      "
              />

              {/* MIDDLE BIG (MAIN) */}
              <div
                className="
        relative z-10
        h-[260px] w-[280px]
        -mx-6
        rounded-3xl
        bg-gradient-to-br from-cyan-500/30 via-blue-500/30 to-purple-500/30
        backdrop-blur-2xl
        border border-white/20
        shadow-2xl
      "
              />

              {/* RIGHT SMALL */}
              <div
                className="
        h-[220px] w-[110px]
        rounded-3xl
        bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-purple-500/20
        backdrop-blur-xl
        border border-white/10
        shadow-xl
        relative
        -top-8
      "
              />

              {/* FLOATING IMAGE */}
              <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[320px] h-[420px] z-20 pointer-events-none">
                <Image
                  src="/doctor-girl.png"
                  alt="AI Doctor Assistant"
                  fill
                  priority
                  className="object-contain select-none"
                />
              </div>
            </div>
          </div>

          {/* RIGHT FEATURE CARD — Updated Colors + Real Online Avatars */}
          <div className="hidden lg:block absolute right-[-40] top-2/5 -translate-y-1/2">
            <div className="relative w-[360px] h-[260px] flex items-end gap-0 isolate">
              {/* LEFT SMALL */}
              <div
                className="
        h-[220px] w-[110px]
        rounded-3xl
        bg-gradient-to-br from-blue-400/20 via-teal-400/20 to-cyan-400/20
        backdrop-blur-xl
        border border-white/10
        shadow-xl
        relative
        -top-8
      "
              />

              {/* MIDDLE BIG (MAIN FEATURE) */}
              <div
                className="
        relative z-10
        h-[260px] w-[280px]
        -mx-6
        rounded-3xl
        bg-gradient-to-br from-blue-600/40 via-teal-500/40 to-cyan-500/40
        backdrop-blur-2xl
        border border-white/20
        shadow-2xl
        flex flex-col items-center justify-center
        text-white
        p-6
      "
              >
                {/* PARTIAL CIRCLE BADGE */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12">
                  <div
                    className="w-full h-full rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center
          clip-[polygon(50%_0%,85%_15%,85%_85%,50%_100%,15%_85%,15%_15%)]"
                  >
                    <span className="font-bold text-white text-sm">24</span>
                  </div>
                </div>

                {/* CONTENT — REAL USER AVATARS */}
                <div className="flex flex-col items-center mt-6">
                  <div className="flex -space-x-3">
                    <img
                      src="https://avatars.githubusercontent.com/u/1?v=4"
                      alt="User 1"
                      className="w-10 h-10 rounded-full border-2 border-white/30"
                    />
                    <img
                      src="https://avatars.githubusercontent.com/u/2?v=4"
                      alt="User 2"
                      className="w-10 h-10 rounded-full border-2 border-white/30"
                    />
                    <img
                      src="https://avatars.githubusercontent.com/u/3?v=4"
                      alt="User 3"
                      className="w-10 h-10 rounded-full border-2 border-white/30"
                    />
                    <img
                      src="https://avatars.githubusercontent.com/u/4?v=4"
                      alt="User 4"
                      className="w-10 h-10 rounded-full border-2 border-white/30"
                    />
                  </div>
                  <p className="mt-3 text-sm text-white/80 text-center">
                    Join 24k+ users who trust us
                  </p>
                </div>
              </div>

              {/* RIGHT SMALL */}
              <div
                className="
        h-[220px] w-[110px]
        rounded-3xl
        bg-gradient-to-br from-blue-400/20 via-teal-400/20 to-cyan-400/20
        backdrop-blur-xl
        border border-white/10
        shadow-xl
        relative
        -top-2
      "
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= DEMO ================= */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ amount: 0.3 }}
        className="py-24"
      >
        <MedicalVoiceAgentDemo />
      </motion.section>

      <section className="py-16 px-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              Nearby Pharmacy Finder
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Detect your location and display nearby pharmacies including name, distance, and address.
            </p>
          </div>
          <div className="flex justify-center">
            <PharmacyFinder />
          </div>
        </div>
      </section>

        <WhyUs />
        <Pricing />
        <Footer />
      </div>

    </div>
  );
}


interface NavbarProps {
  opacity: any;
}

const Navbar = ({ opacity }: NavbarProps) => {
  const { user } = useUser();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl ${
        scrolled ? "border-b border-slate-200/40 dark:border-slate-800/40 shadow-sm" : ""
      }`}
    >
      <motion.div
        style={{ opacity }}
        className="absolute inset-0 bg-white/70 dark:bg-black/60 shadow-[inset_0_0_50px_rgba(255,255,255,0.05)]"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-md" />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            MediAI
          </span>
        </div>

       <div className="hidden md:block">
  <div className="relative rounded-full p-[2px] animate-gradient-x overflow-hidden bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg">
    {/* Inner pill: normal background / foreground */}
    <div className="bg-white/90 dark:bg-black/90 rounded-full px-8 py-2 flex gap-8 font-semibold text-sm cursor-pointer backdrop-blur-md">
      <Link href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors block">Home</Link>
      <Link href="#demo" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors block">Demo</Link>
      <Link href="#why-us" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors block">Why Us</Link>
      <Link href="#pricing" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors block">Pricing</Link>
    </div>
  </div>
</div>

<style jsx>{`
  @keyframes gradient-x {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 3s ease infinite;
  }
`}</style>

        {!user ? (
          <Link href="/sign-in">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white cursor-pointer shadow-md border-0 rounded-full px-6">
              Login
            </Button>
          </Link>
        ) : (
          <div className="flex items-center gap-4">
            <ModeToggle />
            <UserButton />
            <Link href="/home">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white cursor-pointer shadow-md border-0 rounded-full px-6">
                Dashboard
              </Button>
            </Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
};