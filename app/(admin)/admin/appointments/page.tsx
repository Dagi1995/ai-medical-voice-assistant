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
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        Appointments Hub
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Review, approve, reschedule, or cancel patient bookings.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="text" placeholder="Search appointments..." />
                    </div>

                    <Button>
                        <CalendarDays className="w-4 h-4 mr-2" /> New Booking
                    </Button>
                </div>
            </div>
        </div>
    );
}