import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

// Show lines 730-825
for (let i = 729; i <= 825 && i < lines.length; i++) {
  process.stdout.write(`${i + 1}: ${lines[i]}\n`);
}
