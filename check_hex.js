import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

// Show hex bytes for line 817 and surrounding lines
const startLine = 816; // 0-indexed
const endLine = 822;
for (let i = startLine; i < endLine && i < lines.length; i++) {
  const line = lines[i];
  const bytes = Buffer.from(line, 'utf8');
  console.log(`Line ${i + 1}:`);
  console.log(`  Text: "${line}"`);
  console.log(`  Hex: ${Buffer.from(line, 'utf8').toString('hex')}`);
  console.log(`  Length: ${line.length}`);
  console.log('');
}
