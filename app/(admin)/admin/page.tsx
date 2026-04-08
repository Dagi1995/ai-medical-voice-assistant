"use client";

import { motion } from "motion/react";
import { Users, Calendar, MessageSquare, Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

const kpiData = [
  { title: "Total Users", value: "12,450", trend: "+14%", isPositive: true, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
  { title: "Active Appointments", value: "342", trend: "+5%", isPositive: true, icon: Calendar, color: "text-purple-500", bg: "bg-purple-500/10" },
  { title: "AI Interactions", value: "84.2K", trend: "+22%", isPositive: true, icon: MessageSquare, color: "text-pink-500", bg: "bg-pink-500/10" },
  { title: "System Health", value: "99.9%", trend: "-0.1%", isPositive: false, icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10" },
];

const usageData = [
  { name: 'Mon', queries: 4000, users: 2400 },
  { name: 'Tue', queries: 3000, users: 1398 },
  { name: 'Wed', queries: 2000, users: 9800 },
  { name: 'Thu', queries: 2780, users: 3908 },
  { name: 'Fri', queries: 1890, users: 4800 },
  { name: 'Sat', queries: 2390, users: 3800 },
  { name: 'Sun', queries: 3490, users: 4300 },
];

const symptomData = [
  { symptom: 'Headache', count: 450 },
  { symptom: 'Fever', count: 380 },
  { symptom: 'Cough', count: 320 },
  { symptom: 'Fatigue', count: 210 },
  { symptom: 'Nausea', count: 150 },
];

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Overview Insights</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time performance and usage metrics of the AI Agent.</p>
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
              className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm"
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
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">System Usage Over Time</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Comparing active users to total AI queries processed.</p>
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
