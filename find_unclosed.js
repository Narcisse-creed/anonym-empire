import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
const content = fs.readFileSync(filePath, 'utf8');
const lines = content.split(/\r?\n/);

let parenCount = 0;
let braceCount = 0;
let inString = false;
let stringChar = '';
let inTemplate = false;
let inRegex = false;
let escaped = false;
let lastUnclosedParen = 0;
let lastUnclosedBrace = 0;
const newlineRegex = /\r?\n/;

for (let i = 0; i < content.length; i++) {
  const char = content[i];
  const lineNum = content.substring(0, i).split(newlineRegex).length;
  
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
    const next = content[i + 1];
    if (next && next !== '/' && next !== '*') {
      inRegex = true;
      continue;
    }
  }
  
  if (char === '(') {
    parenCount++;
    lastUnclosedParen = lineNum;
  }
  if (char === ')') {
    parenCount--;
    if (parenCount < 0) {
      console.log(`Unexpected ) at line ${lineNum}`);
    }
  }
  if (char === '{') {
    braceCount++;
    lastUnclosedBrace = lineNum;
  }
  if (char === '}') {
    braceCount--;
    if (braceCount < 0) {
      console.log(`Unexpected }} at line ${lineNum}`);
    }
  }
}

console.log(`Final parens: ${parenCount}, braces: ${braceCount}`);
console.log(`Last unclosed paren at line: ${lastUnclosedParen}`);
console.log(`Last unclosed brace at line: ${lastUnclosedBrace}`);

if (lastUnclosedParen > 0) {
  const start = Math.max(0, lastUnclosedParen - 5);
  const end = Math.min(lines.length, lastUnclosedParen + 10);
  console.log('\n--- Lines around last unclosed paren ---');
  for (let i = start; i < end; i++) {
    console.log(`${i + 1}: ${lines[i]}`);
  }
}
