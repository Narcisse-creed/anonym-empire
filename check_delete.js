import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

// Show lines around the delete button
console.log('--- LINES 845-860 ---');
for (let i = 844; i <= 859 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
