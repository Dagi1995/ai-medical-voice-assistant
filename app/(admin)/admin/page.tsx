"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Users, Calendar, MessageSquare, Activity, ArrowUpRight, ArrowDownRight, X, UserPlus, Clock, AlertTriangle, AlertCircle, Info, Bell } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import socket from '@/lib/socket';


export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<{
    totalUsers: string;
    activeAppointments: string;
    aiInteractions: string;
    systemHealth: string;
    usageData: any[];
    symptomData: any[];
    recentActivities: any[];
    alerts: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [timeRange, setTimeRange] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [modalData, setModalData] = useState<{type: 'usage' | 'symptom', payload: any} | null>(null);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<number>>(new Set());
  const [isConnected, setIsConnected] = useState(socket.connected);

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

    // Real-time Socket.io Updates (Replaces HTTP Polling)
    const handleRemoteUpdate = () => {
      console.log('[Socket.io] Real-time DB notification received! Syncing dashboard...');
      fetchDashboardData(true, timeRange);
    };

    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('user:update', handleRemoteUpdate);
    socket.on('appointment:update', handleRemoteUpdate);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('user:update', handleRemoteUpdate);
      socket.off('appointment:update', handleRemoteUpdate);
    };
  }, [fetchDashboardData, timeRange]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="relative flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-200 dark:border-white/10 border-t-blue-600 dark:border-t-blue-500"></div>
            <div className="absolute animate-pulse w-4 h-4 bg-blue-600/50 dark:bg-blue-500/50 rounded-full blur-sm"></div>
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Syncing real-time workspace...</p>
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
              <span className={`inline-flex max-w-max items-center text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${isConnected ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-500/10' : 'text-slate-500 bg-slate-100 dark:bg-slate-800'}`}>
                <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                {isConnected ? `Live updating • ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}` : `Offline • Last sync ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Alert System */}
      <AnimatePresence>
        {data.alerts && data.alerts.filter((a) => !dismissedAlerts.has(a.id)).length > 0 && (
          <div className="flex flex-col gap-3">
            {data.alerts.filter((a) => !dismissedAlerts.has(a.id)).map((alert) => {
              const isCritical = alert.type === 'critical';
              const isWarning = alert.type === 'warning';
              
              const Icon = isCritical ? AlertCircle : isWarning ? AlertTriangle : Info;
              const bgClass = isCritical ? 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-900 dark:text-rose-200' 
                : isWarning ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-900 dark:text-amber-200' 
                : 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20 text-blue-900 dark:text-blue-200';
              const iconColor = isCritical ? 'text-rose-500 dark:text-rose-400' : isWarning ? 'text-amber-600 dark:text-amber-400' : 'text-blue-500 dark:text-blue-400';

              return (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`flex items-start gap-4 p-4 rounded-2xl border ${bgClass} relative pr-12`}
                >
                  <Icon className={`w-6 h-6 flex-shrink-0 mt-0.5 ${iconColor}`} />
                  <div>
                    <h4 className="font-semibold text-sm md:text-base">{alert.title}</h4>
                    <p className="text-sm mt-1 opacity-90">{alert.message}</p>
                    <span className="text-xs font-medium opacity-75 mt-2 block">{alert.time}</span>
                  </div>
                  <button
                    onClick={() => {
                      const newSet = new Set(dismissedAlerts);
                      newSet.add(alert.id);
                      setDismissedAlerts(newSet);
                    }}
                    className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

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
              <AreaChart 
                 data={usageData} 
                 margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                 onClick={(e: any) => {
                   if (e && e.activePayload) {
                     console.log("Area Chart clicked:", e.activePayload[0].payload);
                     setModalData({ type: 'usage', payload: e.activePayload[0].payload });
                   }
                 }}
                 style={{ cursor: 'pointer' }}
              >
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
                <Bar 
                  dataKey="count" 
                  name="Reported Cases" 
                  fill="#f43f5e" 
                  radius={[0, 4, 4, 0]} 
                  barSize={24}
                  cursor="pointer"
                  onClick={(data) => {
                    console.log("Bar clicked:", data);
                    setModalData({ type: 'symptom', payload: data });
                  }} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Recent Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col"
        >
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">Latest actions and events across the system.</p>
            </div>
            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">View All</button>
          </div>
          
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {(data.recentActivities || []).map((activity) => {
              const Icon = activity.type === 'user' ? UserPlus : activity.type === 'ai' ? MessageSquare : activity.type === 'appointment' ? Calendar : Activity;
              return (
                <div key={activity.id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                    activity.type === 'user' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400' : 
                    activity.type === 'ai' ? 'bg-pink-100 text-pink-600 dark:bg-pink-500/20 dark:text-pink-400' : 
                    activity.type === 'appointment' ? 'bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400' : 
                    'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 dark:text-white font-medium text-sm truncate">{activity.title}</p>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Quick Actions Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex flex-col"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Actions</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Frequently used shortcuts.</p>
          </div>
          <div className="flex flex-col gap-3 flex-1">
            <button 
              onClick={() => router.push('/admin/users/new')}
              className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-slate-700 dark:text-slate-300 font-medium group text-sm"
            >
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 group-hover:bg-blue-100 dark:group-hover:bg-blue-500/20 transition-colors">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="flex-1 text-left">Add User</span>
              <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
            </button>

            <button 
              onClick={() => router.push('/admin/appointments/new')}
              className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:text-purple-600 dark:hover:text-purple-400 transition-all text-slate-700 dark:text-slate-300 font-medium group text-sm"
            >
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 group-hover:bg-purple-100 dark:group-hover:bg-purple-500/20 transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="flex-1 text-left">Create Appointment</span>
              <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
            </button>

            <button 
              onClick={() => console.log('Open Send Notification Modal')}
              className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-white/10 hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all text-slate-700 dark:text-slate-300 font-medium group text-sm"
            >
              <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/10 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20 transition-colors">
                <Bell className="w-5 h-5" />
              </div>
              <span className="flex-1 text-left">Send Notification</span>
              <ArrowUpRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {modalData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
            onClick={() => setModalData(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-200 dark:border-white/10 max-w-md w-full relative"
            >
              <button
                onClick={() => setModalData(null)}
                className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-white/5 rounded-full transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
              
              {modalData.type === 'usage' ? (
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pr-8">
                    Usage Analytics ({modalData.payload.name})
                  </h4>
                  <div className="space-y-4">
                    <div className="bg-blue-50 dark:bg-blue-500/10 p-5 rounded-2xl flex justify-between items-center border border-blue-100 dark:border-blue-500/20">
                      <span className="text-blue-600 dark:text-blue-400 font-medium">AI Queries</span>
                      <span className="text-2xl font-bold text-blue-700 dark:text-blue-300">{modalData.payload.queries}</span>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-500/10 p-5 rounded-2xl flex justify-between items-center border border-purple-100 dark:border-purple-500/20">
                      <span className="text-purple-600 dark:text-purple-400 font-medium">Active Users</span>
                      <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">{modalData.payload.users}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6 pr-8">
                    Symptom Analysis ({modalData.payload.symptom})
                  </h4>
                  <div className="bg-rose-50 dark:bg-rose-500/10 p-5 rounded-2xl flex justify-between items-center border border-rose-100 dark:border-rose-500/20">
                    <span className="text-rose-600 dark:text-rose-400 font-medium">Reported Cases</span>
                    <span className="text-2xl font-bold text-rose-700 dark:text-rose-300">{modalData.payload.count}</span>
                  </div>
                  <p className="mt-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5">
                    Detailed insights and related case documentation for patient queries presenting with <strong>{modalData.payload.symptom}</strong>. 
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
