"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, Clock, Save, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTranslation } from "@/lib/LanguageContext";

export default function EditAppointmentPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    
    const [formData, setFormData] = useState({
        patientName: "", // We'll show this but maybe not edit it if it's based on email
        doctorName: "",
        createdOn: "",
        notes: "",
    });

    const [dateTime, setDateTime] = useState({
        date: "",
        time: ""
    });

    useEffect(() => {
        const fetchAppointmentData = async () => {
            try {
                const response = await fetch(`/api/admin/appointments/${params.id}`);
                if (!response.ok) throw new Error("Appointment not found");
                const data = await response.json();
                
                const dateObj = data.createdOn ? new Date(data.createdOn) : new Date();
                
                setFormData({
                    patientName: data.createdBy || "Unregistered Patient",
                    doctorName: data.selectedDoctor?.name || "System AI",
                    createdOn: data.createdOn,
                    notes: data.notes || "",
                });

                setDateTime({
                    date: dateObj.toISOString().split('T')[0],
                    time: dateObj.toTimeString().slice(0, 5)
                });
            } catch (error) {
                toast.error("Failed to load appointment details");
                router.push("/admin/appointments");
            } finally {
                setFetching(false);
            }
        };

        if (params.id) fetchAppointmentData();
    }, [params.id]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Reconstruct the ISO string
            const newCreatedOn = new Date(`${dateTime.date}T${dateTime.time}`).toISOString();

            const response = await fetch(`/api/admin/appointments/${params.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    createdOn: newCreatedOn,
                    notes: formData.notes,
                    selectedDoctor: { name: formData.doctorName }
                }),
            });

            if (!response.ok) throw new Error("Update failed");

            toast.success("Appointment rescheduled successfully!");
            router.push("/admin/appointments");
        } catch (error) {
            toast.error("Failed to reschedule appointment");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <button 
                onClick={() => router.back()}
                className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back to Hub</span>
            </button>

            <div className="space-y-1">
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Reschedule Appointment</h2>
                <p className="text-slate-500 dark:text-slate-400">Modify the date, time, or clinical notes for this session.</p>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 lg:p-8 shadow-sm"
            >
                <form onSubmit={handleSave} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-500" /> Patient
                            </label>
                            <input 
                                disabled
                                value={formData.patientName}
                                className="w-full flex h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-white/5 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-pink-500" /> New Date
                            </label>
                            <input 
                                type="date"
                                required
                                value={dateTime.date}
                                onChange={(e) => setDateTime({...dateTime, date: e.target.value})}
                                className="w-full flex h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Clock className="w-4 h-4 text-purple-500" /> New Time
                            </label>
                            <input 
                                type="time"
                                required
                                value={dateTime.time}
                                onChange={(e) => setDateTime({...dateTime, time: e.target.value})}
                                className="w-full flex h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/10 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                               <FileText className="w-4 h-4 text-emerald-500" /> Notes
                           </label>
                           <input 
                               value={formData.doctorName}
                               onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                               className="w-full h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/10 px-3 py-2 text-sm"
                               placeholder="Modify assigned doctor..."
                           />
                       </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Clinical Notes / Reason for Change</label>
                        <Textarea 
                            rows={4}
                            value={formData.notes}
                            onChange={(e: any) => setFormData({...formData, notes: e.target.value})}
                            className="rounded-2xl border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 focus-visible:ring-blue-500"
                        />
                    </div>

                    <div className="pt-4 flex items-center gap-4">
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : <Save className="w-4 h-4" />}
                            Save Changes
                        </Button>
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => router.back()}
                            className="rounded-xl px-6 h-12"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
