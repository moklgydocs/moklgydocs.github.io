const path = require('path');
const katex = require(process.cwd() + '/node_modules/.pnpm/katex@0.16.45/node_modules/katex/dist/katex.js');
const { parse } = require(process.cwd() + '/node_modules/.pnpm/@vue+compiler-dom@3.5.31/node_modules/@vue/compiler-dom/dist/compiler-dom.cjs.js');
const fs = require('fs');
const file = process.argv[2];
const src = fs.readFileSync(file, 'utf8');
const blocks = [...src.matchAll(/\$\$([\s\S]*?)\$\$/g)].map(m => m[1]);
const inlines = [...src.matchAll(/(?<!\$)\$([^$\n]+?)\$(?!\$)/g)].map(m => m[1]);
console.log('blocks', blocks.length, 'inlines', inlines.length);
let i = 0, dup = 0, kerr = 0;
for (const b of blocks.concat(inlines)) {
  i++;
  try {
    const h = katex.renderToString(b, { displayMode: false });
    try { parse('<div>' + h + '</div>'); }
    catch (e) { dup++; console.log('DUP@', i, e.message, '::', b.replace(/\n/g, ' ').slice(0, 80)); }
  } catch (e) { kerr++; }
}
console.log('scan done, dup:', dup, 'katex-err:', kerr);
