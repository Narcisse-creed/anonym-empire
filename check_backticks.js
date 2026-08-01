import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

let backtickCount = 0;
let backtickLines = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (let j = 0; j < line.length; j++) {
    if (line[j] === '`') {
      backtickCount++;
      backtickLines.push(i + 1);
    }
  }
}

console.log(`Total backticks: ${backtickCount}`);
console.log(`Backtick lines: ${backtickLines.join(', ')}`);
console.log(`Odd count: ${backtickCount % 2 === 1}`);
