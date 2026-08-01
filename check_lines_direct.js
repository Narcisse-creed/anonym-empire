import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

for (let i = 810; i <= 820 && i < lines.length; i++) {
  const line = lines[i];
  const charCodes = [];
  for (let j = 0; j < line.length; j++) {
    charCodes.push(line.charCodeAt(j).toString(16).padStart(2, '0'));
  }
  console.log(`Line ${i + 1}: "${line}"`);
  console.log(`  Codes: ${charCodes.join(' ')}`);
  console.log(`  Last 5 chars: "${line.slice(-5)}" codes: ${charCodes.slice(-5).join(' ')}`);
  console.log('');
}
