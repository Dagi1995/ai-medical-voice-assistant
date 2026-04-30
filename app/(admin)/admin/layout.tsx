"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { 
  HeartPulse, LayoutDashboard, Users, Calendar, 
  Pill, Activity, Bell, Settings, LogOut, Menu, X 
} from "lucide-react";
import { ModeToggle } from "@/app/(routes)/(dashboard)/_components/DarkMood";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { NotificationBadge } from "@/components/NotificationBadge";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "AI Doctors", href: "/admin/ai-doctors", icon: Pill },
  { name: "User Management", href: "/admin/users", icon: Users },
  { name: "AI Monitoring", href: "/admin/ai-monitoring", icon: Activity },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-900 dark:text-white flex overflow-hidden font-sans">
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: mobileOpen ? 0 : 0 }}
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white dark:bg-[#0a0a0a] border-r border-slate-200 dark:border-white/5 flex flex-col transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="h-20 flex items-center px-8 border-b border-slate-100 dark:border-white/5">
          <HeartPulse className="h-8 w-8 text-blue-600 dark:text-blue-500 mr-3" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500 tracking-tight">
            MediAI Admin
          </span>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href} onClick={() => setMobileOpen(false)}>
                <div className={`flex items-center px-4 py-3.5 mt-1 rounded-2xl transition-all duration-200 group relative ${isActive ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold" : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 hover:dark:bg-white/5"}`}>
                  {isActive && (
                    <motion.div layoutId="sidebar-indicator" className="absolute left-0 w-1 y-2 h-8 bg-blue-600 dark:bg-blue-500 rounded-r-full" />
                  )}
                  <Icon className={`w-5 h-5 mr-3 translation-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                  {link.name}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-white/5">
          <Link href="/home">
            <Button variant="outline" className="w-full justify-start rounded-xl h-12 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-white/10 dark:hover:bg-white/5">
              <LogOut className="w-4 h-4 mr-2" />
              Exit Admin
            </Button>
          </Link>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden h-screen">
        
        {/* Topbar */}
        <header className="h-20 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 flex items-center justify-between px-4 lg:px-8 z-30 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 lg:hidden hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:block">
              <h1 className="text-sm font-medium text-slate-500 dark:text-slate-400">Welcome back,</h1>
              <h2 className="text-xl font-bold font-sans tracking-tight">{session?.user?.name || "Admin"}</h2>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <ModeToggle />
            <NotificationBadge href="/admin/notifications" />
            <div 
              onClick={() => signOut()}
              className="h-10 w-10 shrink-0 rounded-full ring-2 ring-slate-200 dark:ring-white/10 overflow-hidden bg-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-300"
              title="Log out"
            >
               <span className="font-bold text-slate-500">{session?.user?.name?.charAt(0)?.toUpperCase() || "A"}</span>
            </div>
          </div>
        </header>

        {/* Page Content Scrollable Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50/50 dark:bg-transparent p-4 lg:p-8 scroll-smooth">
          {children}
        </main>

      </div>
    </div>
  );
}
