import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

const line = lines[816]; // 0-indexed 816 = 1-indexed 817
console.log(`Line 817: "${line}"`);
console.log(`Length: ${line.length}`);
const charCodes = [];
for (let i = 0; i < line.length; i++) {
  charCodes.push(line.charCodeAt(i).toString(16).padStart(2, '0'));
}
console.log(`Codes: ${charCodes.join(' ')}`);

// Show last 10 chars
const last10 = line.slice(-10);
console.log(`Last 10: "${last10}"`);
const last10Codes = [];
for (let i = 0; i < last10.length; i++) {
  last10Codes.push(last10.charCodeAt(i).toString(16).padStart(2, '0'));
}
console.log(`Last 10 codes: ${last10Codes.join(' ')}`);
