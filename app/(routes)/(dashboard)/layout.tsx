import React from "react";
import Sidebar from "./_components/Sidebar";
import DashboardTopBar from "./_components/DashboardTopBar";

function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full h-screen overflow-hidden relative bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Global Animated Background Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] -left-10 w-[30rem] h-[30rem] bg-blue-400/20 dark:bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] -right-10 w-[30rem] h-[30rem] bg-purple-400/20 dark:bg-purple-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-[20%] w-[30rem] h-[30rem] bg-indigo-400/20 dark:bg-indigo-600/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-72 hidden md:block flex-shrink-0 relative z-20">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col pt-3 md:pt-4 h-full overflow-hidden w-full relative z-20">
        <div className="bg-white/70 dark:bg-slate-900/60 backdrop-blur-2xl flex-1 rounded-tl-[2rem] shadow-xl border-t border-l border-white/50 dark:border-slate-700/50 overflow-hidden relative flex flex-col">
          <DashboardTopBar />
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;

