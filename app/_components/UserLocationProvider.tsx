"use client";

import { useEffect } from "react";

interface UserLocationProviderProps {
  onLocationReady: (location: { lat: number; lng: number }) => void;
}

export default function UserLocationProvider({ onLocationReady }: UserLocationProviderProps) {
  useEffect(() => {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by your browser");
      return;
    }

    const success = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      onLocationReady({ lat: latitude, lng: longitude });
    };

    const error = (err: GeolocationPositionError) => {
      console.error("Unable to retrieve your location:", err.message);
    };

    navigator.geolocation.getCurrentPosition(success, error);
  }, [onLocationReady]);

  return null; // invisible component
}