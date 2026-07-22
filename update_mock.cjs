const fs = require('fs');
const d = JSON.parse(fs.readFileSync('generated_data.json'));

let ipStr = 'export const immersionPoints: ImmersionPoint[] = [\n';
d.immersionPoints.forEach(ip => {
  ipStr += `  ${JSON.stringify(ip)},\n`;
});
ipStr += '];\n\n';

let craneStr = 'export const cranes: Crane[] = [\n';
d.cranes.forEach(c => {
  craneStr += `  ${JSON.stringify(c)},\n`;
});
craneStr += '];\n';

const content = fs.readFileSync('src/data/mock.ts', 'utf8');
const lines = content.split('\n');

const startIdx = lines.findIndex(l => l.includes('export const immersionPoints'));
const endIdx = lines.findIndex((l, i) => i > startIdx && l.includes('export const processions'));

if (startIdx !== -1 && endIdx !== -1) {
  const newContent = lines.slice(0, startIdx).join('\n') + '\n' + ipStr + craneStr + '\n' + lines.slice(endIdx).join('\n');
  fs.writeFileSync('src/data/mock.ts', newContent);
  console.log('Updated src/data/mock.ts successfully!');
} else {
  console.log('Could not find markers to replace in src/data/mock.ts');
}
