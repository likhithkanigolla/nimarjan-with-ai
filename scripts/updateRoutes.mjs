import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Very basic parsing to find the routes array in mock.ts
const MOCK_FILE = path.join(__dirname, "../src/data/mock.ts");

async function fetchOSRMRoute(waypoints) {
  if (waypoints.length < 2) return waypoints;
  const coordsString = waypoints.map(wp => `${wp[1]},${wp[0]}`).join(";");
  const url = `http://router.project-osrm.org/route/v1/driving/${coordsString}?overview=full&geometries=geojson`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === "Ok" && data.routes && data.routes.length > 0) {
      // OSRM returns [lon, lat], map back to [lat, lon]
      return data.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);
    }
  } catch (err) {
    console.error("OSRM error:", err);
  }
  return waypoints;
}

async function run() {
  let content = fs.readFileSync(MOCK_FILE, "utf-8");
  
  // Find the routes array export
  const routesRegex = /export const routes: RouteDef\[\] = \[([\s\S]*?)\];/m;
  const match = content.match(routesRegex);
  if (!match) {
    console.error("Could not find routes array in mock.ts");
    return;
  }
  
  const routesText = match[1];
  
  // Extract each route definition
  const routeDefs = routesText.split("\n").filter(l => l.trim().startsWith("{"));
  
  const updatedDefs = [];
  for (let line of routeDefs) {
    const coordMatch = line.match(/coordinates: (\[\[.*?\]\])/);
    if (!coordMatch) {
      updatedDefs.push(line);
      continue;
    }
    
    let waypoints;
    try {
      waypoints = JSON.parse(coordMatch[1]);
    } catch(e) {
      console.error("Failed to parse coordinates in line:", line);
      updatedDefs.push(line);
      continue;
    }
    
    console.log(`Fetching route for ${waypoints.length} waypoints...`);
    // Wait briefly to avoid OSRM rate limits (max 1/sec for free tier without issues)
    await new Promise(r => setTimeout(r, 1000));
    
    const snapped = await fetchOSRMRoute(waypoints);
    
    // Round to 5 decimals to save space
    const compact = snapped.map(c => `[${c[0].toFixed(5)},${c[1].toFixed(5)}]`).join(",");
    
    const newLine = line.replace(/coordinates: \[\[.*?\]\]/, `coordinates: [${compact}]`);
    updatedDefs.push(newLine);
  }
  
  const newRoutesBlock = `export const routes: RouteDef[] = [\n${updatedDefs.join("\n")}\n];`;
  
  content = content.replace(routesRegex, newRoutesBlock);
  fs.writeFileSync(MOCK_FILE, content, "utf-8");
  console.log("mock.ts successfully updated with high-fidelity OSRM routes!");
}

run();
