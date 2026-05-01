"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { motion } from "motion/react";
import {
  History, LayoutDashboard, Stethoscope,
  CreditCard, Settings, HeartPulse, LogOut
} from "lucide-react";

export const menuOptions = [
  {
    id: 1,
    name: "Assistant",
    path: "/home",
    icon: LayoutDashboard,
  },
  {
    id: 2,
    name: "History",
    path: "/history",
    icon: History,
  },
  {
    id: 3,
    name: "Pricing",
    path: "/pricing",
    icon: CreditCard,
  },
  {
    id: 4,
    name: "Doctors",
    path: "/doctors",
    icon: Stethoscope,
  },
  {
    id: 5,
    name: "Settings",
    path: "/settings",
    icon: Settings,
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="h-full flex flex-col bg-white dark:bg-[#0a0a0a] border-r border-slate-200 dark:border-white/5 transition-colors duration-300">
      {/* Branding Header */}
      <div className="h-20 flex items-center px-8 border-b border-slate-100 dark:border-white/5">
        <HeartPulse className="h-8 w-8 text-blue-600 dark:text-blue-500 mr-3" />
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 tracking-tight">
          MediAI
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {menuOptions.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path || (pathname === '/' && item.path === '/home');

          return (
            <Link key={item.id} href={item.path}>
              <div className={`flex items-center px-4 py-3.5 mt-1 rounded-2xl transition-all duration-200 group relative ${isActive ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:dark:bg-white/5"}`}>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 w-1 h-8 bg-blue-600 dark:bg-blue-500 rounded-r-full"
                  />
                )}
                <Icon className={`w-5 h-5 mr-3 transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                <span className="text-[15px]">{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Settings section */}
      <div className="p-6 border-t border-slate-100 dark:border-white/5 gap-2 flex flex-col">
        <div 
          onClick={() => signOut()}
          className="relative group flex items-center px-4 py-3.5 rounded-2xl cursor-pointer hover:bg-slate-100 dark:hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-slate-200 dark:hover:border-white/10">
          <div className="flex items-center w-full">
            <LogOut className="w-5 h-5 mr-3 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium text-[15px] text-slate-600 dark:text-slate-400">Log Out</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

