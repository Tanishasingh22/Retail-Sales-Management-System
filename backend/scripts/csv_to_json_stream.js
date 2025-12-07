const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');

const csvPath = path.join(__dirname, '..', 'data', 'sales.csv');
const outPath = path.join(__dirname, '..', 'data', 'sales.jsonl');

if (!fs.existsSync(csvPath)) {
  console.error("CSV not found!");
  process.exit(1);
}

const input = fs.createReadStream(csvPath, 'utf8');
const output = fs.createWriteStream(outPath, 'utf8');

const parser = parse({
  columns: true,
  skip_empty_lines: true
});

function convertValue(v) {
  if (v === null || v === undefined) return '';
  let s = String(v).trim();
  if (!s) return '';

  // Remove starting/ending quotes
  if (s.startsWith('"') && s.endsWith('"')) {
    s = s.slice(1, -1);
  }

  // Convert numeric values
  const n = Number(s.replace(/,/g, ''));
  return isNaN(n) ? s : n;
}

parser.on('readable', () => {
  let record;
  while ((record = parser.read()) !== null) {
    const obj = {};
    for (const key in record) {
      obj[key.trim()] = convertValue(record[key]);
    }
    output.write(JSON.stringify(obj) + "\n");
  }
});

parser.on('end', () => {
  output.end();
  console.log("✔ Converted CSV → JSONL:", outPath);
});

parser.on('error', err => console.error(err));

input.pipe(parser);
