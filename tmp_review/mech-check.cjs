const fs = require('fs'), path = require('path');
const SRC = 'E:/ai_eng_src/phases', ZH = 'E:/ai_eng_zh/phases';
const issues = [];
const walk = (dir, base, out) => {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, base + '/' + f, out);
    else if (f.endsWith('.md')) out.push(base + '/' + f);
  }
};
const files = []; walk(ZH, '', files);
const FENCE = /^```/gm;
for (const rel of files) {
  const zp = path.join(ZH, rel), sp = path.join(SRC, rel);
  const z = fs.readFileSync(zp, 'utf8');
  const s = fs.existsSync(sp) ? fs.readFileSync(sp, 'utf8') : '';
  const zLines = z.split(/\r?\n/).length, sLines = s.split(/\r?\n/).length;
  if (sLines > 50 && zLines < sLines * 0.6) issues.push('行数骤减 ' + rel + ' ' + zLines + '/' + sLines);
  const fence = (z.match(FENCE) || []).length;
  if (fence % 2 !== 0) issues.push('围栏未闭合 ' + rel + ' ' + fence);
  const enHeads = (z.match(/^#{1,6} [A-Z][A-Za-z0-9 ,:&'\-()\/]{12,}$/gm) || []).filter(h => !/[一-鿿]/.test(h));
  if (enHeads.length) issues.push('英文标题 ' + rel + ' x' + enHeads.length + ' 如:' + enHeads[0].slice(0, 60));
  let inCode = false, enParas = 0;
  for (const ln of z.split(/\r?\n/)) {
    if (/^```/.test(ln)) inCode = !inCode;
    if (!inCode && /^[A-Za-z]/.test(ln) && ln.length > 80 && !/[一-鿿]/.test(ln) && !/^>|^\||^!|^</.test(ln)) enParas++;
  }
  if (enParas > 0) issues.push('疑似未译段落 ' + rel + ' x' + enParas);
  if (z.charCodeAt(0) === 0xFEFF) issues.push('BOM ' + rel);
}
console.log('文件数:', files.length, '问题数:', issues.length);
issues.slice(0, 80).forEach(i => console.log(i));
if (issues.length > 80) console.log('... 其余', issues.length - 80, '条');
