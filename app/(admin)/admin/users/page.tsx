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
        <div></div>
    );
}