const fs = require('fs');
const path = require('path');

const generatedPath = path.resolve(__dirname, 'generated_data.json');

if (!fs.existsSync(generatedPath)) {
  console.error('generated_data.json not found. Run the synthetic data generator first.');
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(generatedPath, 'utf8'));
const immersionPoints = Array.isArray(payload.immersionPoints) ? payload.immersionPoints : [];
const cranes = Array.isArray(payload.cranes) ? payload.cranes : [];

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

fs.writeFileSync('generated_data.json', JSON.stringify({immersionPoints, cranes}, null, 2));
console.log("Done generating to generated_data.json");
