import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

// Show lines 1-30 for import check
console.log('--- LINES 1-30 ---');
for (let i = 0; i < 30; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}

// Show lines around the error
console.log('\n--- LINES 915-925 ---');
for (let i = 914; i < 925 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
