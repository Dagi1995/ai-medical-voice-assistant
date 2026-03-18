import React from "react";
import { 
  Sparkles, 
  Mic, 
  Activity, 
  Calendar, 
  ArrowRight,
  Clock,
  Shield 
} from "lucide-react";
import AddNewSessionDialog from "../_components/AddNewSessionDialog";
import DashboardTopBar from "../_components/DashboardTopBar";

const Dashboard = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex flex-col relative overflow-hidden">
      
      {/* Animated background elements */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <DashboardTopBar />

      <div className="flex-1 flex flex-col items-center justify-center p-4 relative z-10">
        
       

        

        {/* Main content */}
        <div className="text-center max-w-4xl mx-auto">
         

          {/* Main heading with gradient */}
          <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-slate-900 via-blue-800 to-purple-900 dark:from-white dark:via-blue-300 dark:to-purple-300 bg-clip-text text-transparent">
              Welcome to MediVoice
            </span>
          </h1>
          
          {/* Subheading with animated sparkle */}
          <h2 className="text-2xl md:text-4xl font-semibold text-slate-700 dark:text-slate-300 mb-8 flex items-center justify-center gap-3">
            Intelligent Care, Powered by AI
            <Sparkles className="w-8 h-8 text-yellow-500 animate-pulse" />
          </h2>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
            {[
              { icon: Mic, text: "Voice Recording" },
              { icon: Calendar, text: "Smart Scheduling" },
              { icon: Activity, text: "Real-time Analytics" }
            ].map((feature, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-4 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-full border border-slate-200 dark:border-slate-700 shadow-sm"
              >
                <feature.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
          
          {/* CTA Button with enhanced styling */}
          <div className="relative group">
            <div className="relative">
              <AddNewSessionDialog />
            </div>
            
            {/* Helper text */}
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mt-4 flex items-center justify-center gap-2">
              Start a new session in seconds
              <ArrowRight className="w-4 h-4 animate-bounce" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;