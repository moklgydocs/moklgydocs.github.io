const MarkdownIt = require(process.cwd() + '/node_modules/.pnpm/markdown-it@14.1.1/node_modules/markdown-it/dist/markdown-it.min.js');
const { parse } = require(process.cwd() + '/node_modules/.pnpm/@vue+compiler-dom@3.5.31/node_modules/@vue/compiler-dom/dist/compiler-dom.cjs.js');
const fs = require('fs'), path = require('path');
const md = new MarkdownIt({ html: true });
const roots = process.argv.slice(2);
let bad = 0, total = 0;
function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (f.endsWith('.md')) {
      total++;
      const html = md.render(fs.readFileSync(p, 'utf8'));
      try { parse(html); } catch (e) {
        bad++;
        const l = e.loc ? e.loc.start.line : 0, c = e.loc ? e.loc.start.column : 0;
        const hl = html.split('\n')[l - 1] || '';
        console.log(p, '::', e.message, '@' + l + ':' + c, '::', hl.slice(Math.max(0, c - 60), c + 60));
      }
    }
  }
}
roots.forEach(walk);
console.log('---', 'total', total, 'bad', bad);
