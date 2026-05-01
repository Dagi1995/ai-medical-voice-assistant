/**
 * OpenStreetMap Overpass API Utility
 * Fetches nearby health facilities (pharmacies, hospitals, clinics) based on lat/lng.
 */

export interface Facility {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  distance_km: number;
}

/**
 * Calculate distance between two coordinates using the Haversine formula
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Fetch nearby health facilities using Overpass API
 * @param lat Latitude
 * @param lng Longitude
 * @param radiusRadius in meters (default 5000m = 5km)
 * @returns Array of facilities sorted by distance
 */
export async function getNearbyHealthFacilities(
  lat: number,
  lng: number,
  radius: number = 5000
): Promise<Facility[]> {
  // Overpass QL query to find amenities around the location
  // We use [out:json][timeout:25]; to get JSON output and set a 25s timeout.
  // node(around:radius,lat,lon)["amenity"~"pharmacy|hospital|clinic|doctors"];
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"~"pharmacy|hospital|clinic|doctors"](around:${radius},${lat},${lng});
      way["amenity"~"pharmacy|hospital|clinic|doctors"](around:${radius},${lat},${lng});
    );
    out center;
  `;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept": "application/json",
        "User-Agent": "AIMedicalVoiceAgent/1.0"
      },
      body: `data=${encodeURIComponent(query)}`,
    });

    if (!response.ok) {
      console.error("Overpass API error:", response.status, response.statusText);
      return [];
    }

    const data = await response.json();
    const facilities: Facility[] = [];

    if (data && data.elements) {
      for (const el of data.elements) {
        // Some facilities might not have a name, we skip them or give them a generic name
        const name = el.tags?.name || el.tags?.["name:en"] || "Unnamed Facility";
        const type = el.tags?.amenity || "unknown";
        
        // For 'node', coordinates are direct. For 'way', we get center coordinates.
        const fLat = el.lat || el.center?.lat;
        const fLng = el.lon || el.center?.lon;

        if (fLat && fLng) {
          const distance = calculateDistance(lat, lng, fLat, fLng);
          facilities.push({
            id: el.id.toString(),
            name,
            type,
            lat: fLat,
            lng: fLng,
            distance_km: parseFloat(distance.toFixed(2)),
          });
        }
      }
    }

    // Sort by distance and return top 15
    return facilities.sort((a, b) => a.distance_km - b.distance_km).slice(0, 15);
  } catch (error) {
    console.error("Failed to fetch nearby facilities:", error);
    return [];
  }
}
