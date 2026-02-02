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
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import DoctorAgentCard, { doctorAgent } from "./DoctorAgentCard";
import SuggestedDoctorCard from "./SuggestedDoctorCard";
function AddNewSessionDialog() {
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<doctorAgent>();
  const [suggstedDoctors, setSuggstedDoctors] = useState<
    doctorAgent[] | undefined
  >();

  const OnclickNext = async () => {
    setLoading(true);

    try {
      const result = await axios.post("/api/suggest-doctors", {
        notes: note,
      });
      console.log(result.data);
      console.log("Suggested Doctors:", result.data);

      const payload = result.data;
      let doctorsArray: doctorAgent[] = [];

      if (Array.isArray(payload)) {
        doctorsArray = payload;
      } else if (typeof payload === "string") {
        try {
          const parsed = JSON.parse(payload);
          doctorsArray = Array.isArray(parsed)
            ? parsed
            : (parsed?.doctors ??
              parsed?.data ??
              parsed?.suggestedDoctors ??
              []);
        } catch (e) {
          console.warn(
            "Failed to parse string payload from suggest-doctors:",
            e
          );
        }
      } else if (payload && typeof payload === "object") {
        doctorsArray =
          payload?.suggestedDoctors && Array.isArray(payload.suggestedDoctors)
            ? payload.suggestedDoctors
            : payload?.doctors && Array.isArray(payload.doctors)
              ? payload.doctors
              : payload?.data && Array.isArray(payload.data)
                ? payload.data
                : payload?.suggested && Array.isArray(payload.suggested)
                  ? payload.suggested
                  : [];
      }

      setSuggstedDoctors(doctorsArray);
    } catch (e) {
      console.error("suggest-doctors request failed:", e);
      setSuggstedDoctors([]);
    } finally {
      setLoading(false);
    }
  };
  const onStartConsultation = async () => {
    setLoading(true);
    const result = await axios.post("/api/session-chat", {
      notes: note,
      selectedDoctor: selectedDoctor,
    });
    console.log("New Session Created:", result.data);
    if (result.data?.sessionId) {
      console.log("Session ID:", result.data.sessionId);
    }
    setLoading(false);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="mt-3">+ Start a Consultation</Button>
      </DialogTrigger>
      <DialogContent id="add-session-dialog">
        <DialogHeader>
          <DialogTitle>Add Basic Details</DialogTitle>
          <DialogDescription asChild>
            {!suggstedDoctors ? (
              <div>
                <h2>Add Symptoms or Other Details</h2>
                <Textarea
                  placeholder="Add Detail here..."
                  className="h=[200px] mt-1"
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            ) : (
              <div>
                <h2>Select The Doctor</h2>
                <div className="grid grid-cols-2 gap-5">
                  {suggstedDoctors.map((doctor, index) => (
                    <SuggestedDoctorCard
                      doctorAgent={doctor}
                      key={index}
                      setSelectedDoctor={() => setSelectedDoctor(doctor)}
                      //@ts-ignore
                      selectedDoctor={selectedDoctor}
                    ></SuggestedDoctorCard>
                  ))}
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          {!suggstedDoctors ? (
            <Button disabled={!note || loading} onClick={OnclickNext}>
              {loading ? "Loading..." : "Next"} <ArrowRight />
            </Button>
          ) : (
            <Button
              onClick={() => onStartConsultation()}
              disabled={!selectedDoctor || loading}
            >
              Start Consultation
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewSessionDialog;
