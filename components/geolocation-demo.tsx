"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Loader2, AlertCircle, CheckCircle } from "lucide-react";

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

interface AddressData {
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    suburb?: string;
    neighbourhood?: string;
    road?: string;
    house_number?: string;
    postcode?: string;
    country?: string;
    state?: string;
    county?: string;
  };
}

export default function GeolocationDemo() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [address, setAddress] = useState<AddressData | null>(null);
  const [loading, setLoading] = useState(false);
  const [geocodingLoading, setGeocodingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<PermissionState | null>(null);

  // Check if geolocation is supported
  const isGeolocationSupported = typeof navigator !== "undefined" && "geolocation" in navigator;

  // Function to get current location
  const getCurrentLocation = () => {
    if (!isGeolocationSupported) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    setLoading(true);
    setError(null);
    setLocation(null);
    setAddress(null);
    setGeocodingError(null);

    // Options for geolocation request
    const options: PositionOptions = {
      enableHighAccuracy: true, // Request high accuracy
      timeout: 10000, // 10 second timeout
      maximumAge: 300000, // Accept cached position up to 5 minutes old
    };

    navigator.geolocation.getCurrentPosition(
      // Success callback
      (position: GeolocationPosition) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        setLocation(locationData);
        setLoading(false);
        setError(null);

        // Start reverse geocoding
        reverseGeocode(locationData.latitude, locationData.longitude);
      },
      // Error callback
      (err: GeolocationPositionError) => {
        let errorMessage = "";

        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Location access denied by user. Please enable location permissions in your browser settings.";
            setPermissionStatus("denied");
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable. Please check your GPS or network connection.";
            break;
          case err.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
          default:
            errorMessage = `An unknown error occurred: ${err.message}`;
            break;
        }

        setError(errorMessage);
        setLoading(false);
      },
      // Options
      options
    );
  };

  // Function to reverse geocode coordinates to address
  const reverseGeocode = async (lat: number, lon: number) => {
    setGeocodingLoading(true);
    setGeocodingError(null);

    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'AI-Medical-Voice-Assistant/1.0' // Required by Nominatim
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data: AddressData = await response.json();

      if (data && data.display_name) {
        setAddress(data);
      } else {
        throw new Error("No address found for this location");
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
      let errorMessage = "Failed to get address information.";

      if (err instanceof Error) {
        if (err.message.includes("fetch")) {
          errorMessage = "Network error: Unable to connect to geocoding service. Please check your internet connection.";
        } else if (err.message.includes("API error")) {
          errorMessage = "Geocoding service temporarily unavailable. Please try again later.";
        } else {
          errorMessage = err.message;
        }
      }

      setGeocodingError(errorMessage);
    } finally {
      setGeocodingLoading(false);
    }
  };

  // Function to check permission status
  const checkPermissionStatus = async () => {
    if ("permissions" in navigator) {
      try {
        const result = await navigator.permissions.query({ name: "geolocation" });
        setPermissionStatus(result.state);
        result.addEventListener("change", () => {
          setPermissionStatus(result.state);
        });
      } catch (err) {
        console.log("Permission API not supported");
      }
    }
  };

  // Check permission on component mount
  React.useEffect(() => {
    checkPermissionStatus();
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Geolocation Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Information */}
        <div className="text-sm text-muted-foreground">
          {!isGeolocationSupported && (
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              Geolocation not supported
            </div>
          )}
          {permissionStatus && (
            <div className="flex items-center gap-2">
              {permissionStatus === "granted" && (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-green-600">Location permission granted</span>
                </>
              )}
              {permissionStatus === "denied" && (
                <>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span className="text-red-600">Location permission denied</span>
                </>
              )}
              {permissionStatus === "prompt" && (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-yellow-600">Location permission required</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Get Location Button */}
        <Button
          onClick={getCurrentLocation}
          disabled={loading || !isGeolocationSupported}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Getting Location...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              Get My Location
            </>
          )}
        </Button>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Location Display */}
        {location && (
          <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">
                Location Found!
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Latitude:</span>
                <span className="font-mono">{location.latitude.toFixed(6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Longitude:</span>
                <span className="font-mono">{location.longitude.toFixed(6)}</span>
              </div>
              {location.accuracy && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Accuracy:</span>
                  <span className="font-mono">±{location.accuracy.toFixed(0)} meters</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timestamp:</span>
                <span className="font-mono text-xs">
                  {new Date(location.timestamp).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Address Display */}
        {address && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                Address Information
              </span>
            </div>
            <div className="space-y-2 text-sm">
              {/* City/Area */}
              <div>
                <span className="text-muted-foreground">Location:</span>
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  {address.address?.city ||
                   address.address?.town ||
                   address.address?.village ||
                   "Unknown City"}
                  {address.address?.suburb && `, ${address.address.suburb}`}
                </div>
              </div>

              {/* Area/Neighborhood */}
              {(address.address?.neighbourhood || address.address?.suburb) && (
                <div>
                  <span className="text-muted-foreground">Area:</span>
                  <div className="font-medium">
                    {address.address.neighbourhood || address.address.suburb}
                  </div>
                </div>
              )}

              {/* Street Address */}
              {(address.address?.road || address.address?.house_number) && (
                <div>
                  <span className="text-muted-foreground">Street:</span>
                  <div className="font-medium">
                    {address.address.house_number && `${address.address.house_number} `}
                    {address.address.road || "Unknown Street"}
                  </div>
                </div>
              )}

              {/* Full Address */}
              <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
                <span className="text-muted-foreground">Full Address:</span>
                <div className="font-medium text-xs leading-relaxed mt-1">
                  {address.display_name}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Geocoding Loading */}
        {geocodingLoading && (
          <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-yellow-600" />
              <span className="text-sm text-yellow-800 dark:text-yellow-200">
                Getting address information...
              </span>
            </div>
          </div>
        )}

        {/* Geocoding Error */}
        {geocodingError && (
          <div className="p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-md">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-orange-800 dark:text-orange-200">{geocodingError}</p>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Click "Get My Location" to request your current position</p>
          <p>• Allow location access when prompted by your browser</p>
          <p>• Location data is processed locally and not stored</p>
          <p>• Address information is fetched from OpenStreetMap (free service)</p>
        </div>
      </CardContent>
    </Card>
  );
}