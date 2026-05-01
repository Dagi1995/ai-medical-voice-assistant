export interface Facility {
  id: string;
  name: string;
  type: string;
  lat: number;
  lng: number;
  distance_km: number;
}

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

export async function getNearbyHealthFacilities(
  lat: number,
  lng: number,
  radius: number = 5000
): Promise<Facility[]> {
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
      const text = await response.text();
      console.error("Body:", text);
      return [];
    }

    const data = await response.json();
    const facilities: Facility[] = [];

    if (data && data.elements) {
      for (const el of data.elements) {
        const name = el.tags?.name || el.tags?.["name:en"] || "Unnamed Facility";
        const type = el.tags?.amenity || "unknown";
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

    return facilities.sort((a, b) => a.distance_km - b.distance_km).slice(0, 15);
  } catch (error) {
    console.error("Failed to fetch nearby facilities:", error);
    return [];
  }
}

async function main() {
  const lat = 9.0222;
  const lng = 38.7468;
  console.log("Fetching facilities for", lat, lng);
  const facilities = await getNearbyHealthFacilities(lat, lng, 5000);
  console.log("Result length:", facilities.length);
  if (facilities.length > 0) {
      console.log(facilities[0]);
  }
}

main().catch(console.error);
