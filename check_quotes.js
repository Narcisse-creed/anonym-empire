import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

let singleQuoteCount = 0;
let doubleQuoteCount = 0;
let backtickCount = 0;
const singleQuoteLines = [];
const doubleQuoteLines = [];
const backtickLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    // Skip escaped quotes
    if (char === '\\') {
      j++;
      continue;
    }
    // Skip content inside comments
    if (char === '/' && line[j + 1] === '/') {
      break;
    }
    
    if (char === "'") singleQuoteCount++;
    if (char === '"') doubleQuoteCount++;
    if (char === '`') backtickCount++;
  }
}

console.log(`Single quotes: ${singleQuoteCount} (${singleQuoteCount % 2 === 0 ? 'even' : 'ODD'})`);
console.log(`Double quotes: ${doubleQuoteCount} (${doubleQuoteCount % 2 === 0 ? 'even' : 'ODD'})`);
console.log(`Backticks: ${backtickCount} (${backtickCount % 2 === 0 ? 'even' : 'ODD'})`);
