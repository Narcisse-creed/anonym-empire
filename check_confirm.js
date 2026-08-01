import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

for (let i = 801; i <= 810 && i < lines.length; i++) {
  const line = lines[i];
  const bytes = Buffer.from(line, 'utf8');
  console.log(`Line ${i + 1}:`);
  console.log(`  Text: "${line}"`);
  console.log(`  Hex: ${bytes.toString('hex')}`);
  console.log(`  Length: ${line.length}`);
  console.log('');
}
