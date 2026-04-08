"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Users, Calendar, MessageSquare, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<{
    totalUsers: string;
    activeAppointments: string;
    aiInteractions: string;
    systemHealth: string;
    usageData: any[];
    symptomData: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  const fetchDashboardData = useCallback(async (isPolling = false, range = 'weekly') => {
    try {
      if (!isPolling) setLoading(true);
      const response = await fetch(`/api/admin/dashboard?range=${range}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const result = await response.json();
      setData(result);
      setLastUpdated(new Date());
      if (!isPolling) setError(null);
    } catch (err: any) {
      if (!isPolling) setError(err.message || 'An error occurred');
      console.error('Polling error:', err);
    } finally {
      if (!isPolling) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(false, timeRange); // Initial execution

    // Polling setup: Can be easily replaced by WebSocket setup in the future
    const intervalId = setInterval(() => {
      fetchDashboardData(true, timeRange);
    }, 10000);

    return () => clearInterval(intervalId); // Cleanup logic
  }, [fetchDashboardData, timeRange]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[50vh]">
        <div className="text-rose-500 font-medium">Error: {error}</div>
      </div>
    );
  }

  if (!data) return null;

  const kpiData = [
    { title: "Total Users", value: data.totalUsers, trend: "+14%", isPositive: true, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10", route: "/admin/users" },
    { title: "Active Appointments", value: data.activeAppointments, trend: "+5%", isPositive: true, icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/10", route: "/admin/appointments" },
    { title: "AI Interactions", value: data.aiInteractions, trend: "+22%", isPositive: true, icon: MessageSquare, color: "text-pink-500", bg: "bg-pink-500/10", route: "/admin/ai-monitoring" },
    { title: "System Health", value: data.systemHealth, trend: "-0.1%", isPositive: false, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10", route: "/admin/system-health" },
  ];

  const { usageData, symptomData } = data;

  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Overview Insights</h2>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-1">
            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Real-time performance and usage metrics of the AI Agent.</p>
            {lastUpdated && (
              <span className="inline-flex max-w-max items-center text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10 px-2.5 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                Live updating {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {kpiData.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => router.push(kpi.route)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  router.push(kpi.route);
                }
              }}
              className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center text-sm font-semibold ${kpi.isPositive ? "text-emerald-500" : "text-rose-500"}`}>
                  {kpi.trend}
                  {kpi.isPositive ? <ArrowUpRight className="w-4 h-4 ml-1" /> : <ArrowDownRight className="w-4 h-4 ml-1" />}
                </div>
              </div>
              <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm">{kpi.title}</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1 tracking-tight">{kpi.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        {/* Main Area Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm"
        >
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">System Usage Over Time</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Comparing active users to total AI queries processed.</p>
            </div>
            {/* Filter Toggle */}
            <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl w-max">
              {(['daily', 'weekly', 'monthly'] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setTimeRange(r)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all duration-200 ${
                    timeRange === r 
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={usageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend verticalAlign="top" height={36} iconType="circle" />
                <Area type="monotone" dataKey="queries" name="AI Queries" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
                <Area type="monotone" dataKey="users" name="Active Users" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Common Symptoms</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Most frequent user complaints this week.</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={symptomData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#334155" opacity={0.2} />
                <XAxis type="number" hide />
                <YAxis dataKey="symptom" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#64748b', fontWeight: 500 }} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#1e293b', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" name="Reported Cases" fill="#f43f5e" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
