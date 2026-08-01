import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

// Show lines around the products section
console.log('--- LINES 859-890 ---');
for (let i = 858; i <= 889 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
