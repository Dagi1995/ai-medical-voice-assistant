"use client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function MedicalVoiceAgentDemo() {
  const images = [
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1080", // Doctor consultation
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w-1080", // Medical technology
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w-1080", // Voice interface visualization
    "https://images.unsplash.com/photo-1586773860418-dc22f8b874bc?q=80&w-1080", // AI medical interface
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w-1080", // Healthcare mobile app
    "https://images.unsplash.com/photo-1516549655669-df565bc4d3b6?q=80&w-1080", // Doctor with tablet
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=1080", // Hospital location map
    "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=1080", // Medical chatbot UI
    "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1080", // Health data visualization
    "https://images.unsplash.com/photo-1554734867-bf3c00a49371?q=80&w=1080", // Voice waveform
    "https://images.unsplash.com/photo-1578496780158-5cb8b7d1026e?q=80&w=1080", // Healthcare accessibility
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1080", // Digital health interface
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1080", // Medical AI concept
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=1080", // Health tech innovation
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1080", // Symptom checker UI
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1080", // Patient consultation
    "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=1080", // Telemedicine concept
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=1080", // Medical guidance app
    "https://images.unsplash.com/photo-1586773860418-dc22f8b874bc?q=80&w=1080", // AI diagnosis concept
    "https://images.unsplash.com/photo-1516549655669-df565bc4d3b6?q=80&w=1080", // Healthcare provider
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?q=80&w=1080", // Geolocation services
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1080", // Voice interaction design
    "https://images.unsplash.com/photo-1554734867-bf3c00a49371?q=80&w=1080", // Speech technology
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?q=80&w=1080", // Medical AI algorithms
    "https://images.unsplash.com/photo-1578496780158-5cb8b7d1026e?q=80&w=1080", // Healthcare in Ethiopia
    "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?q=80&w=1080", // Digital health platform
    "https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?q=80&w=1080", // Health data analytics
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1080", // Medical assistance
    "https://images.unsplash.com/photo-1551601651-2a8555f1a136?q=80&w=1080", // Technology for health
    "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=1080", // Healthcare innovation
  ];

  return (
    <div className="relative mx-auto my-10 flex h-screen w-full max-w-7xl flex-col items-center justify-center overflow-hidden rounded-3xl">
      <h2 className="relative z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl">
        Revolutionizing healthcare access with{" "}
        <span className="relative z-20 inline-block text-blue-500 rounded-xl px-4 py-2 decoration-[6px] underline-offset-[16px] ">
          voice AI
        </span>{" "}
        and intelligent guidance.
      </h2>
      <div className="relative z-20 mx-auto max-w-3xl py-10 text-center text-sm text-neutral-200 md:text-base">
        <div className="mb-6">
          <div className="text-xl md:text-2xl text-neutral-100 font-light mb-3 leading-relaxed">
            <span className="font-semibold text-sky-300">
              Voice-powered healthcare
            </span>{" "}
            delivering:
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-500 to-blue-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative px-5 py-2.5 bg-black rounded-lg border border-sky-500/30">
                <span className="text-neutral-100 font-medium">
                  Symptom Analysis
                </span>
              </div>
            </div>

            <div className="text-white/40 hidden md:block">→</div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative px-5 py-2.5 bg-black rounded-lg border border-emerald-500/30">
                <span className="text-neutral-100 font-medium">
                  Medical Guidance
                </span>
              </div>
            </div>

            <div className="text-white/40 hidden md:block">→</div>

            <div className="group relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
              <div className="relative px-5 py-2.5 bg-black rounded-lg border border-purple-500/30">
                <span className="text-neutral-100 font-medium">
                  Hospital Locator
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-lg text-neutral-300 font-light max-w-2xl mx-auto">
          Bridging healthcare accessibility gaps in{" "}
          <span className="font-medium text-white underline decoration-sky-500/50 underline-offset-4">
            Ethiopia's urban communities
          </span>{" "}
          through intelligent voice technology.
        </div>
      </div>
      <div className="relative z-20 flex flex-wrap items-center justify-center gap-4 pt-4">
        <button className="rounded-md bg-sky-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-sky-700 focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
          Try Voice Demo
        </button>
        <button className="rounded-md border border-white/20 bg-white/10 px-6 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/20 focus:ring-2 focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-black focus:outline-none">
          View Project Details
        </button>
      </div>

      {/* overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-black/80 dark:bg-black/40" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full"
        images={images}
      />
    </div>
  );
}
