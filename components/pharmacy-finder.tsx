"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface LatLng {
  latitude: number;
  longitude: number;
}

interface PharmacyPlace {
  id: number;
  name: string;
  address: string;
  lat: number;
  lon: number;
  distance: number; // meters
}

const earthRadiusM = 6371000;

const haversineDistance = (from: LatLng, to: LatLng) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusM * c;
};

export default function PharmacyFinder() {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [pharmacies, setPharmacies] = useState<PharmacyPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState<number>(5000); // Default 5km

  const fetchNearbyPharmacies = async (lat: number, lon: number, searchRadius: number = radius) => {
    setError(null);
    setLoading(true);

    try {
      const query = `[out:json];node["amenity"="pharmacy"](around:${searchRadius},${lat},${lon});out center;`;
      const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Pharmacy API failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.elements || data.elements.length === 0) {
        setPharmacies([]);
        setError("No nearby pharmacies found within 5 km.");
      } else {
        const results = data.elements
          .filter((el: any) => el.type === "node" && el.tags)
          .map((el: any) => {
            const placeLoc = { latitude: el.lat, longitude: el.lon };
            return {
              id: el.id,
              name: el.tags.name || "Unnamed Pharmacy",
              address:
                [el.tags["addr:housenumber"], el.tags["addr:street"], el.tags["addr:city"]]
                  .filter(Boolean)
                  .join(", ") || "Address not available",
              lat: el.lat,
              lon: el.lon,
              distance: haversineDistance({ latitude: lat, longitude: lon }, placeLoc),
            };
          })
          .sort((a: PharmacyPlace, b: PharmacyPlace) => a.distance - b.distance);

        setPharmacies(results);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load nearby pharmacies.");
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshPharmacies = () => {
    if (location) {
      fetchNearbyPharmacies(location.latitude, location.longitude, radius);
    }
  };

  const getLocationAndPharmacies = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);
    setPharmacies([]);

    // First try with lower accuracy for faster results
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        fetchNearbyPharmacies(latitude, longitude, radius);
      },
      (err) => {
        // If first attempt fails, try with high accuracy
        if (err.code === err.TIMEOUT) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              setLocation({ latitude, longitude });
              fetchNearbyPharmacies(latitude, longitude, radius);
            },
            (fallbackErr) => {
              setLoading(false);
              switch (fallbackErr.code) {
                case fallbackErr.PERMISSION_DENIED:
                  setError("Location permission denied. Please allow location access and retry.");
                  break;
                case fallbackErr.POSITION_UNAVAILABLE:
                  setError("Location unavailable. Please try again from a different place.");
                  break;
                case fallbackErr.TIMEOUT:
                  setError("Location request timed out. This can happen if GPS signal is weak or you're indoors. Try moving to a window or outdoors, then retry.");
                  break;
                default:
                  setError("An unknown location error occurred.");
                  break;
              }
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 300000 }
          );
        } else {
          setLoading(false);
          switch (err.code) {
            case err.PERMISSION_DENIED:
              setError("Location permission denied. Please allow location access and retry.");
              break;
            case err.POSITION_UNAVAILABLE:
              setError("Location unavailable. Please try again from a different place.");
              break;
            case err.TIMEOUT:
              setError("Location request timed out. This can happen if GPS signal is weak or you're indoors. Try moving to a window or outdoors, then retry.");
              break;
            default:
              setError("An unknown location error occurred.");
              break;
          }
        }
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
    );
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Find Nearby Pharmacies
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Press the button and allow geolocation to retrieve nearby pharmacies from OpenStreetMap. Location detection may take up to 20 seconds in some cases.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Button onClick={getLocationAndPharmacies} disabled={loading} className="flex-1 sm:flex-none">
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</> : "Find Nearby Pharmacies"}
          </Button>

          {location && (
            <div className="flex gap-2 items-center">
              <select
                value={radius}
                onChange={(e) => setRadius(parseInt(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white dark:bg-gray-800 dark:border-gray-600"
              >
                <option value={1000}>1 km</option>
                <option value={3000}>3 km</option>
                <option value={5000}>5 km</option>
              </select>

              <Button onClick={refreshPharmacies} disabled={loading} variant="outline" size="icon">
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {location && (
          <div className="text-xs text-muted-foreground">
            Your location: {location.latitude.toFixed(6)}, {location.longitude.toFixed(6)} | Search radius: {(radius / 1000).toFixed(0)} km
          </div>
        )}

        {error && (
          <div className="p-3 rounded-md bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-200">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {pharmacies.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr>
                  <th className="px-3 py-2 border-b">Name</th>
                  <th className="px-3 py-2 border-b">Distance</th>
                  <th className="px-3 py-2 border-b">Address</th>
                </tr>
              </thead>
              <tbody>
                {pharmacies.map((pharmacy) => (
                  <tr key={pharmacy.id} className="odd:bg-slate-50 dark:odd:bg-slate-800">
                    <td className="p-2">{pharmacy.name}</td>
                    <td className="p-2">{(pharmacy.distance / 1000).toFixed(2)} km</td>
                    <td className="p-2">{pharmacy.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && pharmacies.length === 0 && !error && (
          <p className="text-sm text-muted-foreground">No results yet. Click “Find Nearby Pharmacies” to search.</p>
        )}
      </CardContent>
    </Card>
  );
}