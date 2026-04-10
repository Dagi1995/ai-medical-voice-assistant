"use client";

import { motion } from "motion/react";
import { Plus, MapPin, Phone, CheckCircle, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockPharmacies = [
    { id: 1, name: "City Health Pharmacy", address: "124 Main St, Downtown", phone: "+1 234-567-8900", status: "Active", stock: "94% Available" },
    { id: 2, name: "MediCare Plus", address: "800 West Ave, Suburb", phone: "+1 234-567-8901", status: "Active", stock: "85% Available" },
    { id: 3, name: "Sunrise Drugstore", address: "402 East Blvd, Central", phone: "+1 234-567-8902", status: "Inactive", stock: "Offline" },
];

export default function PharmaciesPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Pharmacy Network</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Add, update, or remove partner pharmacies and monitor stock connectivity.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search pharmacy..."
                            className="w-full md:w-64 pl-9 pr-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-slate-400 dark:text-white transition-all"
                        />
                    </div>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg px-6 rounded-xl">
                        <Plus className="w-5 h-5 mr-1" /> Add Pharmacy
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {mockPharmacies.map((pharmacy, i) => (
                    <motion.div
                        key={pharmacy.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                        {pharmacy.status === "Active" ? (
                            <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-bl-xl border-b border-l border-emerald-500/20">
                                ACTIVE
                            </div>
                        ) : (
                            <div className="absolute top-0 right-0 px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-bl-xl border-b border-l border-rose-500/20">
                                OFFLINE
                            </div>
                        )}

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 pr-16">{pharmacy.name}</h3>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-start text-sm text-slate-600 dark:text-slate-400">
                                <MapPin className="w-4 h-4 mr-2 mt-0.5 shrink-0 text-blue-500" />
                                <span>{pharmacy.address}</span>
                            </div>
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <Phone className="w-4 h-4 mr-2 shrink-0 text-purple-500" />
                                <span>{pharmacy.phone}</span>
                            </div>
                            <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300">
                                <CheckCircle className="w-4 h-4 mr-2 shrink-0 text-emerald-500" />
                                <span>Stock Integration: {pharmacy.stock}</span>
                            </div>
                        </div>
                        [4/8/2026 5:36 AM] Boni: <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                            <Button variant="outline" size="sm" className="bg-transparent border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300">
                                Manage Stock
                            </Button>
                            <div className="flex gap-2">
                                <button className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors">
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}