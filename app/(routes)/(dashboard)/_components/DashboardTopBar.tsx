"use client";

import React, { useEffect, useState } from "react";
import { ModeToggle } from "./DarkMood";
import moment from "moment";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { createPortal } from "react-dom";

const DashboardTopBar = () => {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  useEffect(() => {
    setMounted(true);
  }, []);

  // auto-close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <div className="relative z-50 flex items-center justify-between px-6 md:px-10 py-6 bg-transparent border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden p-2 -ml-2 text-gray-600 dark:text-gray-300"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex flex-col">
            <h2 className="font-bold text-lg text-black dark:text-white">
              Hey, {user?.firstName || "Guest"}!
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {mounted ? moment().format('MMMM DD, YYYY') : <span className="opacity-0">Loading...</span>}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <ModeToggle />
        </div>
      </div>

      {mounted && isMobileMenuOpen && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] md:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Sidebar Drawer */}
          <div className="relative w-72 h-full bg-white dark:bg-slate-950 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300">
            <button 
              className="absolute top-6 right-4 p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="h-full pt-4">
               <Sidebar />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default DashboardTopBar;
