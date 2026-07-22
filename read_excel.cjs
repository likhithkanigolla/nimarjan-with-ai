const fs = require('fs');
const path = require('path');

const generatedPath = path.resolve(__dirname, 'generated_data.json');

if (!fs.existsSync(generatedPath)) {
  console.error('generated_data.json not found. Run the synthetic data generator first.');
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(generatedPath, 'utf8'));
console.log(JSON.stringify(payload, null, 2));
