"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { MessageSquare, Clock, User, ChevronRight, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AIMonitoringPage() {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/sessions");
            const data = await res.json();
            if (res.ok) {
                setSessions(data);
            } else {
                toast.error("Failed to fetch sessions");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const filteredSessions = sessions.filter(s => 
        s.sessionId?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        s.createdBy?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">AI Monitoring</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor real-time AI interactions and user sessions.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search sessions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-64 pl-9 pr-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-slate-400 dark:text-white transition-all"
                    />
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredSessions.map((session) => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-5 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between group hover:border-blue-500 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <MessageSquare className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white">Session {session.sessionId.slice(0, 8)}...</h3>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                            <User className="w-3 h-3" /> {session.createdBy || "Guest"}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-slate-500">
                                            <Clock className="w-3 h-3" /> {new Date(session.createdOn).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Language</p>
                                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{session.language}</p>
                                </div>
                                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                    {filteredSessions.length === 0 && (
                        <div className="text-center py-20 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
                            <p className="text-slate-500">No active sessions found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
