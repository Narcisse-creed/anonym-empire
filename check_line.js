import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
for (let i = 915; i <= 925; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}
