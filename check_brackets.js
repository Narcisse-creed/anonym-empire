import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const content = fs.readFileSync(filePath, 'utf8');

let parenCount = 0;
let braceCount = 0;
let bracketCount = 0;
let backtickCount = 0;
let inString = false;
let stringChar = '';
let inTemplate = false;
let inRegex = false;
let escaped = false;
let errors = [];

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  const lineNum = content.substring(0, i).split(/\r?\n/).length;
  
  if (escaped) {
    escaped = false;
    continue;
  }
  
  if (char === '\\' && (inString || inTemplate)) {
    escaped = true;
    continue;
  }
  
  if (inRegex) {
    if (char === '/' && !escaped) {
      inRegex = false;
    }
    continue;
  }
  
  if (inString) {
    if (char === stringChar) {
      inString = false;
      stringChar = '';
    }
    continue;
  }
  
  if (inTemplate) {
    if (char === '`') {
      inTemplate = false;
    }
    continue;
  }
  
  if (char === '"' || char === "'") {
    inString = true;
    stringChar = char;
    continue;
  }
  
  if (char === '`') {
    inTemplate = true;
    continue;
  }
  
  if (char === '/') {
    // Could start a regex if followed by non-slash
    const next = content[i + 1];
    if (next && next !== '/' && next !== '*') {
      inRegex = true;
      continue;
    }
  }
  
  if (char === '(') parenCount++;
  if (char === ')') parenCount--;
  if (char === '{') braceCount++;
  if (char === '}') braceCount--;
  if (char === '[') bracketCount++;
  if (char === ']') bracketCount--;
  
  if (parenCount < 0 || braceCount < 0 || bracketCount < 0) {
    errors.push(`Unexpected closing at line ${lineNum}, char "${char}"`);
  }
}

console.log(`Parens: ${parenCount}, Braces: ${braceCount}, Brackets: ${bracketCount}`);
if (errors.length > 0) {
  console.log('Errors:', errors);
} else {
  console.log('No unexpected closings found');
}
