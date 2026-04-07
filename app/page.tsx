"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { Button } from "@/components/ui/button";
import { MedicalVoiceAgentDemo } from "./_components/Feature3dGrid";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";

import { HeroSection } from "./_components/HeroSection";
import { AdsStrip } from "./_components/AdsStrip";
import { WhyUs } from "./_components/WhyUs";
import { Pricing } from "./_components/Pricing";
import { Footer } from "./_components/Footer";

/* ===========================
   HOME
=========================== */
export default function Home() {
  const { scrollY } = useScroll();
  const navbarOpacity = useTransform(scrollY, [0, 80], [0.75, 0.95]);

  return (
    <div className="relative min-h-screen w-full bg-white dark:bg-[#0a0a0a] overflow-x-hidden selection:bg-purple-500/30">
      
      {/* SoftAurora has been removed from the global layout and placed squarely back inside the HeroSection component! */}

      <div className="relative z-10 w-full h-full text-slate-900 dark:text-white">
        <Navbar opacity={navbarOpacity} />

        <HeroSection />
        <AdsStrip />
        
        {/* ================= DEMO ================= */}
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

        <WhyUs />
        <Pricing />
        <Footer />
      </div>
    </div>
  );
}

/* ===========================
   NAVBAR
=========================== */
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
