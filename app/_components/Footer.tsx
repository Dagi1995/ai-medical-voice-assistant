"use client";

import Link from 'next/link';
import { useTheme } from 'next-themes';
import Antigravity from '@/components/Antigravity';
import { useEffect, useState } from 'react';

export function Footer() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';
  
  // Dynamic color for Antigravity particles based on theme
  const particleColor = mounted ? (isDark ? '#e11d48' : '#3b82f6') : '#e11d48';

  return (
    <footer className="relative border-t border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-black/90 min-h-[500px] flex flex-col justify-center overflow-hidden isolate">
      
      {/* Background Antigravity */}
      <div className="absolute inset-0 -z-10 opacity-70 dark:opacity-90 pointer-events-none">
        <Antigravity 
          count={250} 
          autoAnimate={true}
          color={particleColor} 
          particleSize={1.8}
          ringRadius={12}
          magnetRadius={15}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-12 relative z-10 py-16">
        <div className="flex flex-col gap-6 w-full md:w-2/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-xl"/>
            <span className="font-bold text-4xl tracking-tight text-slate-900 dark:text-white">MediAI</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-lg">
            Next-generation AI medical assistant. Bridging the gap between patients and healthcare with intelligent, 24/7 support.
          </p>
        </div>
        
        <div className="flex flex-col gap-6 w-full md:w-auto mt-8 md:mt-0">
          <h4 className="font-bold text-slate-900 dark:text-white text-xl">Quick Links</h4>
          <div className="flex flex-col gap-4 font-medium text-slate-600 dark:text-slate-400">
            <Link href="#demo" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Interactive Demo</Link>
            <Link href="#why-us" className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors">Why Choose Us</Link>
            <Link href="#pricing" className="hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Plans & Pricing</Link>
          </div>
        </div>

        <div className="flex flex-col gap-6 w-full md:w-auto text-slate-500 dark:text-slate-400">
          <h4 className="font-bold text-slate-900 dark:text-white text-xl">Legal</h4>
          <Link href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Privacy Policy</Link>
          <div className="pt-6 mt-4 border-t border-slate-300 dark:border-white/20 font-medium">
            © {new Date().getFullYear()} MediAI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
