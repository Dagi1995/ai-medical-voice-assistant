"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { ArrowLeft, Calendar, User, Stethoscope, FileText, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

import { useTranslation } from "@/lib/LanguageContext";
import { LanguageSwitcher } from "@/components/language-switcher";

export default function NewBookingPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        patientName: "",
        doctorName: "",
        type: "General Checkup",
        notes: "",
        language: "English"
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/admin/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to create booking");

            setSuccess(true);
            toast.success(t("successTitle"));
            
            setTimeout(() => {
                router.push("/admin/appointments");
            }, 1000);
        } catch (error) {
            console.error(error);
            toast.error("Error creating appointment");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="max-w-xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center"
                >
                    <CheckCircle2 className="w-12 h-12" />
                </motion.div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t("successTitle")}</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">{t("successSubtitle")}</p>
                </div>
                <div className="animate-pulse flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 font-medium">
                    <span className="w-2 h-2 bg-current rounded-full"></span>
                    {t("redirecting")}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => router.back()}
                    className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">{t("backToHub")}</span>
                </button>
                <LanguageSwitcher />
            </div>

            <div className="space-y-1">
                <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{t("bookingTitle")}</h2>
                <p className="text-slate-500 dark:text-slate-400">{t("bookingSubtitle")}</p>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-6 lg:p-8 shadow-sm"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <User className="w-4 h-4 text-blue-500" /> {t("patientName")}
                            </label>
                            <input 
                                required
                                value={formData.patientName}
                                onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                                placeholder={t("patientNamePlaceholder")}
                                className="w-full flex h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Stethoscope className="w-4 h-4 text-purple-500" /> {t("assignedDoctor")}
                            </label>
                            <input 
                                required
                                value={formData.doctorName}
                                onChange={(e) => setFormData({...formData, doctorName: e.target.value})}
                                placeholder={t("doctorPlaceholder")}
                                className="w-full flex h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-pink-500" /> {t("preferredLanguage")}
                            </label>
                            <select 
                                value={formData.language}
                                onChange={(e) => setFormData({...formData, language: e.target.value})}
                                className="w-full flex h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option>English</option>
                                <option>አማርኛ</option>
                                <option>Afaan Oromoo</option>
                                <option>Spanish</option>
                                <option>French</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-500" /> {t("clinicalNotes")}
                        </label>
                        <Textarea 
                            rows={4}
                            value={formData.notes}
                            onChange={(e: any) => setFormData({...formData, notes: e.target.value})}
                            placeholder={t("notesPlaceholder")}
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
                            ) : <Send className="w-4 h-4" />}
                            {t("submitButton")}
                        </Button>
                        <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={() => router.back()}
                            className="rounded-xl px-6 h-12"
                        >
                            {t("cancelButton")}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
