const xlsx = require('xlsx');
const workbook = xlsx.readFile('GHMC Ganesh Immersion Master Data.xlsx');
for (const sheetName of workbook.SheetNames) {
  console.log('--- ' + sheetName + ' ---');
  console.log(JSON.stringify(xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]), null, 2));
}
