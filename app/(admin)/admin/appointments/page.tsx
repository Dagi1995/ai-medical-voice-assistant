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
        <div className="max-w-7xl mx-auto space-y-8"></div>
    );
}