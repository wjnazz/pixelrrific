import fs from 'fs';
const file = fs.readFileSync('./src/lib/imageProcessor.ts', 'utf8');
console.log(file.includes('const parsedMaxColors = parseInt(maxColors as any, 10);'));
