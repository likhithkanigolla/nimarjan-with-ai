import type { LatLng } from "@/lib/types";

/**
 * Fetches a route from the public OSRM API.
 * @param waypoints An array of [lat, lng] coordinates to route through.
 * @returns A promise that resolves to an array of [lat, lng] coordinates representing the road-snapped route.
 */
export async function fetchOSRMRoute(waypoints: LatLng[]): Promise<LatLng[]> {
  if (waypoints.length < 2) return waypoints;

  // OSRM expects coordinates in lng,lat format joined by semicolons
  const coordsString = waypoints.map(wp => `${wp[1]},${wp[0]}`).join(";");
  
  const url = `https://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
      console.warn("OSRM routing failed:", data.code);
      return waypoints; // Fallback to straight lines
    }

    // OSRM returns GeoJSON coordinates as [lng, lat]. We must map them back to Leaflet's [lat, lng].
    const geometry: [number, number][] = data.routes[0].geometry.coordinates;
    return geometry.map((coord) => [coord[1], coord[0]] as LatLng);
  } catch (error) {
    console.error("Error fetching route from OSRM:", error);
    return waypoints; // Fallback to straight lines
  }
}
