import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const buffer = fs.readFileSync(filePath);

console.log('First 50 bytes:');
const bytes = [];
for (let i = 0; i < 50 && i < buffer.length; i++) {
  bytes.push(buffer[i].toString(16).padStart(2, '0'));
}
console.log(bytes.join(' '));
console.log('');
console.log('Has BOM:', buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF);
console.log('First char:', buffer[0]);
console.log('File size:', buffer.length);
