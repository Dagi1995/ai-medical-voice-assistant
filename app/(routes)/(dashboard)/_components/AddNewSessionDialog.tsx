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
import { ArrowRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { doctorAgent } from "./DoctorAgentCard";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

function AddNewSessionDialog() {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
  const [suggestedDoctors, setSuggestedDoctors] = useState<doctorAgent[]>();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { theme, systemTheme } = useTheme();
  const router = useRouter();

  // After mounting, we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine current theme
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = mounted && currentTheme === "dark";

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
          className={`mt-3 ${
            isDark
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              : ""
          }`}
        >
          + Start a Consultation
        </Button>
      </DialogTrigger>

      <DialogContent
        className={`${
          isDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
        }`}
      >
        <DialogHeader>
          <DialogTitle className={isDark ? "text-gray-100" : "text-gray-900"}>
            Add Basic Details
          </DialogTitle>

          <DialogDescription asChild>
            {!suggestedDoctors ? (
              <div>
                <h2
                  className={`text-sm font-medium mb-2 ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Add Symptoms or Other Details
                </h2>

                <Textarea
                  placeholder="Describe your symptoms here..."
                  className={`h-[200px] mt-2 ${
                    isDark
                      ? "bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                      : "bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
                  }`}
                  disabled={loading}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />

                {loading && (
                  <div
                    className={`flex items-center gap-2 mt-3 text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Finding the best doctors for you...
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2
                  className={`mb-3 font-semibold ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  Select The Doctor
                </h2>

                <div className="grid grid-cols-2 gap-5">
                  {suggestedDoctors.length === 0 && !loading ? (
                    <p
                      className={`col-span-2 ${
                        isDark ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      No doctors found. Try describing your symptoms
                      differently.
                    </p>
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

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              disabled={loading}
              className={
                isDark
                  ? "border-gray-700 bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }
            >
              Cancel
            </Button>
          </DialogClose>

          {!suggestedDoctors ? (
            <Button
              disabled={!note || loading}
              onClick={OnclickNext}
              className={
                isDark && !(!note || loading)
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  : ""
              }
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Next <ArrowRight />
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={onStartConsultation}
              disabled={!selectedDoctor || loading}
              className={
                isDark && !(!selectedDoctor || loading)
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  : ""
              }
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Start Consultation"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
