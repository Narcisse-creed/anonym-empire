import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

// Extract lines 755-825
const startLine = 754; // 0-indexed
const endLine = 825;
let text = '';
for (let i = startLine; i < endLine && i < lines.length; i++) {
  text += lines[i] + '\n';
}

console.log('--- COLLECTIONS BLOCK ---');
console.log(text);

let parenCount = 0;
let braceCount = 0;
let inString = false;
let stringChar = '';
let inTemplate = false;
let inRegex = false;
let escaped = false;
const newlineRegex = /\r?\n/;

for (let i = 0; i < text.length; i++) {
  const char = text[i];
  if (escaped) { escaped = false; continue; }
  if (char === '\\' && (inString || inTemplate)) { escaped = true; continue; }
  if (inRegex) { if (char === '/' && !escaped) inRegex = false; continue; }
  if (inString) { if (char === stringChar) { inString = false; stringChar = ''; } continue; }
  if (inTemplate) { if (char === '`') inTemplate = false; continue; }
  if (char === '"' || char === "'") { inString = true; stringChar = char; continue; }
  if (char === '`') { inTemplate = true; continue; }
  if (char === '/') { const next = text[i + 1]; if (next && next !== '/' && next !== '*') { inRegex = true; continue; } }
  if (char === '(') parenCount++;
  if (char === ')') parenCount--;
  if (char === '{') braceCount++;
  if (char === '}') braceCount--;
}

console.log('Parens:', parenCount, 'Braces:', braceCount);
