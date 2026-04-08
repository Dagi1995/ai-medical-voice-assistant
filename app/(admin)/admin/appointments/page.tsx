"use client";

import { motion } from "motion/react";
import { Search, CalendarDays, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockAppointments = [
    { id: "A101", patient: "Alice Freeman", doctor: "Dr. Robert Chen", date: "April 8, 2026", time: "10:00 AM", status: "Upcoming", type: "General Checkup" },
    { id: "A102", patient: "Michael Chang", doctor: "Dr. Sarah Smith", date: "April 8, 2026", time: "01:30 PM", status: "Pending", type: "Follow-up" },
    { id: "A103", patient: "Emma Thompson", doctor: "Dr. Richard Davis", date: "April 7, 2026", time: "09:15 AM", status: "Completed", type: "Consultation" },
    { id: "A104", patient: "David Brown", doctor: "Dr. Robert Chen", date: "April 9, 2026", time: "11:00 AM", status: "Cancelled", type: "Vaccination" },
];

export default function AppointmentsPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Appointments Hub</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Review, approve, reschedule, or cancel patient bookings.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search appointments..."
                            className="w-full md:w-64 pl-9 pr-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-slate-400 dark:text-white transition-all"
                        />
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg px-6 rounded-xl">
                        <CalendarDays className="w-4 h-4 mr-2" /> New Booking
                    </Button>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
            >
                {['Total Bookings', 'Pending Approval', 'Completed Today', 'Cancellations'].map((stat, i) => (
                    <div key={stat} className="p-5 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-between">
                        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat}</span>
                        <span className="text-2xl font-bold text-slate-900 dark:text-white">{[124, 12, 45, 3][i]}</span>
                    </div>
                ))}
            </motion.div>
            [4/8/2026 5:35 AM] Boni: <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm"
            >
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-transparent">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Patient & Doctor</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Time</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Quick Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockAppointments.map((apt) => (
                                <tr key={apt.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{apt.patient}</div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400">{apt.doctor}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{apt.date}</div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center mt-0.5">
                                            <Clock className="w-3 h-3 mr-1" /> {apt.time}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                        {apt.type}
                                    </td>
                                    <td className="px-6 py-4">
                                        {apt.status === "Upcoming" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400">Upcoming</span>}
                                        {apt.status === "Pending" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400">Pending</span>}
                                        {apt.status === "Completed" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">Completed</span>}
                                        {apt.status === "Cancelled" && <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400">Cancelled</span>}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        {apt.status === "Pending" && (
                                            <Button variant="outline" size="sm" className="h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20">
                                                <CheckCircle2 className="w-4 h-4 mr-1.5" /> Approve
                                            </Button>
                                        )}
                                        {(apt.status === "Upcoming" || apt.status === "Pending") && (
                                            <Button variant="outline" size="sm" className="h-8 rounded-lg bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10">
                                                [4/8/2026 5:35 AM] Boni: <XCircle className="w-4 h-4 mr-1.5" /> Cancel
                                            </Button>
                                        )}
                                        <Button variant="ghost" size="sm" className="h-8 text-blue-600 dark:text-blue-400">Reschedule</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
}