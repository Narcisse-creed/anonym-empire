import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

for (let i = 815; i <= 825 && i < lines.length; i++) {
  const line = lines[i];
  console.log(`${i + 1}: ${line}`);
  console.log(`   Length: ${line.length}`);
  // Show last 10 chars
  console.log(`   Last 10 chars: "${line.slice(-10)}"`);
  console.log(`   Char codes: ${Array.from(line.slice(-10)).map(c => c.charCodeAt(0)).join(' ')}`);
}
