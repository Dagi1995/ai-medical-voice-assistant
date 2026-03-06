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
        <Button className="mt-3">+ Start a Consultation</Button>
      </DialogTrigger>

      <DialogContent id="add-session-dialog">
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>

          <DialogDescription asChild>
            {!suggestedDoctors ? (
              <div>
                <h2>Add Symptoms or Other Details</h2>

                <Textarea
                  placeholder="Describe your symptoms here..."
                  className="h-[200px] mt-2"
                  disabled={loading}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />

                {loading && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Finding the best doctors for you...
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h2 className="mb-3 font-semibold">Select The Doctor</h2>

                <div className="grid grid-cols-2 gap-5">
                  {suggestedDoctors.length === 0 && !loading ? (
                    <p className="text-gray-500 col-span-2">
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
            <Button variant="outline" disabled={loading}>
              Cancel
            </Button>
          </DialogClose>

          {!suggestedDoctors ? (
            <Button disabled={!note || loading} onClick={OnclickNext}>
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
