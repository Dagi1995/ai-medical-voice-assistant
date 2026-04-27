"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, MoreVertical, Trash2, User, FileText, Loader2, X, Pill, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AIDoctorsPage() {
    const [doctors, setDoctors] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Form state
    const [name, setName] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [description, setDescription] = useState("");
    const [agentPrompt, setAgentPrompt] = useState("");
    const [voiceId, setVoiceId] = useState("andrew");
    const [knowledgeFile, setKnowledgeFile] = useState<File | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isFetchingDetails, setIsFetchingDetails] = useState(false);

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/ai-doctors");
            const data = await res.json();
            if (res.ok) {
                setDoctors(data);
            } else {
                toast.error(data.error || "Failed to fetch doctors");
            }
        } catch (error) {
            toast.error("An error occurred while fetching doctors");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDoctor = async (id: number) => {
        try {
            setIsFetchingDetails(true);
            const res = await fetch(`/api/admin/ai-doctors?id=${id}`);
            const data = await res.json();
            if (res.ok) {
                setSelectedDoctor(data);
                setIsDetailsOpen(true);
            } else {
                toast.error("Failed to load doctor details");
            }
        } catch (error) {
            toast.error("Error fetching doctor details");
        } finally {
            setIsFetchingDetails(false);
        }
    };

    const handleCreateDoctor = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);

        const formData = new FormData();
        formData.append("name", name);
        formData.append("specialty", specialty);
        formData.append("description", description);
        formData.append("agentPrompt", agentPrompt);
        formData.append("voiceId", voiceId);
        if (knowledgeFile) {
            formData.append("knowledgeFile", knowledgeFile);
        }

        try {
            const res = await fetch("/api/admin/ai-doctors", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                toast.success("AI Doctor created successfully!");
                setIsModalOpen(false);
                resetForm();
                fetchDoctors();
            } else {
                const data = await res.json();
                toast.error(data.error || "Failed to create doctor");
            }
        } catch (error) {
            toast.error("An error occurred while creating doctor");
        } finally {
            setIsCreating(false);
        }
    };

    const [deletingId, setDeletingId] = useState<number | null>(null);

    const handleDeleteDoctor = async (id: number) => {
        if (!confirm("Are you sure you want to delete this AI Doctor? All associated knowledge will also be removed.")) return;

        try {
            setDeletingId(id);
            const res = await fetch(`/api/admin/ai-doctors?id=${id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Doctor deleted successfully");
                fetchDoctors();
            } else {
                toast.error("Failed to delete doctor");
            }
        } catch (error) {
            toast.error("An error occurred while deleting doctor");
        } finally {
            setDeletingId(null);
        }
    };

    const resetForm = () => {
        setName("");
        setSpecialty("");
        setDescription("");
        setAgentPrompt("");
        setVoiceId("andrew");
        setKnowledgeFile(null);
    };

    const filteredDoctors = doctors.filter(doc => 
        doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">AI Doctors</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Create and manage your AI medical agents and their RAG knowledge.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search doctors..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full md:w-64 pl-9 pr-4 py-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm placeholder:text-slate-400 dark:text-white transition-all"
                        />
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 px-6">
                        <Plus className="w-4 h-4 mr-2" /> Create Doctor
                    </Button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredDoctors.map((doctor) => (
                        <motion.div
                            key={doctor.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm group hover:shadow-md transition-all relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleDeleteDoctor(doctor.id)}
                                    disabled={deletingId === doctor.id}
                                    className="p-2 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 transition-colors disabled:opacity-50"
                                >
                                    {deletingId === doctor.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                                    <Pill className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 dark:text-white text-lg">{doctor.name}</h3>
                                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{doctor.specialty}</p>
                                </div>
                            </div>

                            <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-6">
                                {doctor.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5">
                                <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleViewDoctor(doctor.id)}
                                    disabled={isFetchingDetails}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg"
                                >
                                    {isFetchingDetails ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <FileText className="w-3 h-3 mr-1" />}
                                    View Details
                                </Button>
                                <div className="flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${doctor.hasRag ? "bg-emerald-500 animate-pulse" : "bg-slate-300 dark:bg-slate-700"}`} />
                                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                                         {doctor.hasRag ? "RAG Enabled" : "Base Model"}
                                     </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* View Doctor Details Modal */}
            <AnimatePresence>
                {isDetailsOpen && selectedDoctor && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-3xl overflow-hidden max-h-[90vh] flex flex-col"
                        >
                            <div className="flex items-center justify-between p-8 border-b border-slate-100 dark:border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-500/20 text-blue-600 flex items-center justify-center">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{selectedDoctor.name}</h3>
                                        <p className="text-sm text-slate-500">{selectedDoctor.specialty}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsDetailsOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto space-y-8">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">System Prompt</h4>
                                    <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/5 text-sm leading-relaxed text-slate-700 dark:text-slate-300 italic">
                                        "{selectedDoctor.agentPrompt}"
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider">RAG Knowledge Base</h4>
                                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                                            {selectedDoctor.knowledge?.length || 0} Chunks
                                        </span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {selectedDoctor.knowledge && selectedDoctor.knowledge.length > 0 ? (
                                            selectedDoctor.knowledge.map((k: any, idx: number) => (
                                                <div key={idx} className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-sm shadow-sm">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="w-5 h-5 flex items-center justify-center bg-slate-100 dark:bg-slate-700 rounded text-[10px] font-bold">
                                                            {idx + 1}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 font-mono">ID: {k.id}</span>
                                                    </div>
                                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                                        {k.content}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12 bg-slate-50 dark:bg-white/5 rounded-3xl border border-dashed border-slate-200 dark:border-white/10">
                                                <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                                                <p className="text-slate-500 text-sm">No knowledge chunks found for this agent.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex justify-end">
                                <Button onClick={() => setIsDetailsOpen(false)} className="rounded-xl px-8">
                                    Close
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Create Doctor Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 w-full max-w-2xl overflow-hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-white/5">
                                <h3 className="text-xl font-bold">Create New AI Doctor</h3>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateDoctor} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold ml-1">Doctor Name</label>
                                        <input 
                                            required value={name} onChange={e => setName(e.target.value)}
                                            placeholder="e.g. Dr. Sarah Jenkins"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold ml-1">Specialty</label>
                                        <input 
                                            required value={specialty} onChange={e => setSpecialty(e.target.value)}
                                            placeholder="e.g. Cardiologist"
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Description</label>
                                    <textarea 
                                        required value={description} onChange={e => setDescription(e.target.value)}
                                        placeholder="Brief summary of the doctor's personality and goals..."
                                        rows={3}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1">Agent Prompt (System Instructions)</label>
                                    <textarea 
                                        required value={agentPrompt} onChange={e => setAgentPrompt(e.target.value)}
                                        placeholder="Define how the AI should behave, speak, and interact..."
                                        rows={4}
                                        className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold ml-1">Voice Selection</label>
                                        <select 
                                            value={voiceId} onChange={e => setVoiceId(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                                        >
                                            <option value="andrew">Andrew (Professional Male)</option>
                                            <option value="emma">Emma (Warm Female)</option>
                                            <option value="brian">Brian (Deep Male)</option>
                                            <option value="sarah">Sarah (Soft Female)</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold ml-1">Knowledge File (for RAG)</label>
                                        <div className="relative group">
                                            <input 
                                                type="file" accept=".txt,.pdf"
                                                onChange={e => setKnowledgeFile(e.target.files?.[0] || null)}
                                                className="hidden" id="file-upload"
                                            />
                                            <label 
                                                htmlFor="file-upload"
                                                className="w-full px-4 py-3 bg-slate-50 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 rounded-2xl flex items-center justify-center gap-2 cursor-pointer group-hover:border-blue-500 group-hover:text-blue-500 transition-all text-slate-500"
                                            >
                                                <Upload className="w-4 h-4" />
                                                <span className="text-sm font-medium">{knowledgeFile ? knowledgeFile.name : "Upload Knowledge Base"}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-2xl py-6 border-slate-200 dark:border-white/10">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={isCreating} className="flex-1 rounded-2xl py-6 bg-blue-600 hover:bg-blue-700 text-white">
                                        {isCreating ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                                        Create AI Agent
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
