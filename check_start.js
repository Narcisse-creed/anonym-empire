import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

for (let i = 753; i <= 770 && i < lines.length; i++) {
  const line = lines[i];
  console.log(`${i + 1}: ${line}`);
}
