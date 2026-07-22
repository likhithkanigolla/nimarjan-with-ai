const xlsx = require('xlsx');
const workbook = xlsx.readFile('GHMC Ganesh Immersion Master Data.xlsx');
let allData = [];
for (const sheetName of workbook.SheetNames) {
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  allData = allData.concat(data);
}

const parseCoord = (coordStr) => {
  if (!coordStr) return [0, 0];
  const parts = coordStr.split(',').map(s => parseFloat(s.replace(/[^0-9.]/g, '')));
  return parts.length === 2 ? parts : [0, 0];
};

const parseCranes = (craneStr) => {
  if (!craneStr || typeof craneStr !== 'string') return 0;
  const match = craneStr.match(/(\d+)/);
  return match ? parseInt(match[1]) : 0;
};

const immersionPoints = [];
const cranes = [];
let craneIdCounter = 1;

allData.forEach((row, i) => {
  const ipId = `IP-${String(i + 1).padStart(2, '0')}`;
  const totalCranes = parseCranes(row["Number of Cranes Allocated"]);
  const coords = parseCoord(row["Coordinates (Lat, Long)"]);
  
  immersionPoints.push({
    id: ipId,
    name: row["Site Name"],
    coordinates: coords,
    safe_crowd_capacity: 2000,
    current_crowd: Math.floor(Math.random() * 1000) + 500,
    queue_length: Math.floor(Math.random() * 20),
    available_cranes: totalCranes > 0 ? Math.floor(Math.random() * totalCranes) + 1 : 0,
    total_cranes: totalCranes,
    average_service_time: 10 + Math.floor(Math.random() * 5),
    status: "OPERATIONAL"
  });
  
  for(let c = 0; c < totalCranes; c++) {
    const cId = `CR-${String(craneIdCounter++).padStart(2, '0')}`;
    const status = Math.random() > 0.3 ? "AVAILABLE" : "BUSY";
    cranes.push({
      id: cId,
      immersion_point_id: ipId,
      status: status,
      max_supported_weight: 3000,
      max_supported_height: 15,
      supported_idol_types: ["Eco-Friendly", "PoP/Synthetic"],
      estimated_service_time: 12
    });
  }
});

const fs = require('fs');
fs.writeFileSync('generated_data.json', JSON.stringify({immersionPoints, cranes}, null, 2));
console.log("Done generating to generated_data.json");
