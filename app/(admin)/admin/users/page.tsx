"use client";
import { motion } from "motion/react";
import { Search, Shield, ShieldBan, MoreVertical, ActivitySquare } from "lucide-react";
import { Button } from "@/components/ui/button";


const mockUsers = [
    { id: "1", name: "Alice Freeman", email: "alice@example.com", role: "Patient", status: "Active", lastActive: "10 mins ago" },
    { id: "2", name: "Dr. Robert Chen", email: "robert@medical.ai", role: "Doctor", status: "Active", lastActive: "1 hour ago" },
    { id: "3", name: "Sarah Williams", email: "sarah.w@example.com", role: "Patient", status: "Blocked", lastActive: "2 days ago" },
    { id: "4", name: "Michael Chang", email: "m.chang@example.com", role: "Patient", status: "Active", lastActive: "Just now" },
    { id: "5", name: "Emma Thompson", email: "emma.t@admin.ai", role: "Admin", status: "Active", lastActive: "5 mins ago" },
];

export default function UserManagementPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                        User Management
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Manage user roles, block access, and monitor activity.
                    </p>
                </div>
            </div>
        </div>
    );
}