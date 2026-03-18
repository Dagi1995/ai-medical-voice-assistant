"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { ArrowRight, Loader2, Sparkles, Bot, Stethoscope } from "lucide-react";
import { useState } from "react";
import { doctorAgent } from "./DoctorAgentCard";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { useRouter } from "next/navigation";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // Reset dialog state
  const resetDialog = () => {
    setNote("");
    setSuggestedDoctors(undefined);
    setSelectedDoctor(undefined);
    setLoading(false);
  };

  // Fetch suggested doctors from AI
  const OnclickNext = async () => {
    if (!note || loading) return;

    try {
      setLoading(true);
      const result = await axios.post("/api/suggest-doctors", { notes: note });
      const payload = result.data;

      const doctorsArray = payload?.suggestedDoctors || [];
      setSuggestedDoctors(doctorsArray);
    } catch (err) {
      console.error("Suggest doctors failed:", err);
      setSuggestedDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const onStartConsultation = async () => {
    if (!selectedDoctor) return;

    try {
      setLoading(true);
      const result = await axios.post("/api/session-chat", {
        notes: note,
        selectedDoctor,
      });

      if (result.data?.sessionId) {
        router.push(`/medical-agent/${result.data.sessionId}`);
      }
    } catch (err) {
      console.error("Session creation failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) resetDialog();
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="relative px-8 py-8 md:px-12 md:py-8 text-lg font-bold rounded-2xl overflow-hidden group border border-slate-700/50 dark:border-slate-300/20 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02] transition-all duration-300 shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
        >
          {/* Animated gradient background on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-500" />
          
          <span className="relative z-10 flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-yellow-400 dark:text-yellow-600 animate-pulse" /> 
            Start AI Consultation
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-2xl sm:rounded-3xl"
      >
        <DialogHeader>
          <DialogTitle className="text-slate-900 dark:text-slate-100 flex items-center gap-2 text-2xl">
            <Bot className="w-6 h-6 text-blue-500" />
            AI Intake Assistant
          </DialogTitle>

          <DialogDescription asChild>
            {!suggestedDoctors ? (
              <div className="mt-6">
                <h2 className="text-sm font-semibold mb-3 text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Describe your symptoms
                </h2>

                <Textarea
                  placeholder="How are you feeling today? e.g. I have a headache and mild fever..."
                  className="h-[180px] p-4 resize-none bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus-visible:ring-blue-500/50 focus-visible:border-blue-500 rounded-2xl shadow-inner transition-all"
                  disabled={loading}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />

                {loading && (
                  <div className="flex items-center gap-3 mt-4 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-100 dark:border-blue-900">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI is analyzing your symptoms and finding the best specialists...
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="mb-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-yellow-500" />
                  Recommended Specialists
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  {suggestedDoctors.length === 0 && !loading ? (
                    <div className="col-span-2 p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
                      <p className="text-slate-500 dark:text-slate-400">
                        No specific doctors found. Try adding more details about your symptoms.
                      </p>
                    </div>
                  ) : (
                    suggestedDoctors.map((doctor, index) => (
                      <SuggestedDoctorCard
                        key={index}
                        doctorAgent={doctor}
                        selectedDoctor={selectedDoctor || null}
                        setSelectedDoctor={setSelectedDoctor}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-6 sm:mt-8 gap-3 sm:gap-0">
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={loading}
              className="rounded-xl border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Cancel
            </Button>
          </DialogClose>

          {!suggestedDoctors ? (
            <Button
              disabled={!note || loading}
              onClick={OnclickNext}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/20 transition-all group"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Analyze Symptoms <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={onStartConsultation}
              disabled={!selectedDoctor || loading}
              className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md shadow-blue-500/20 transition-all group"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Start Consultation <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
