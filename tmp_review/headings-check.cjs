const fs = require('fs'), path = require('path');
const ZH = 'E:/ai_eng_zh/phases';
const issues = [];
const walk = (dir, base, out) => {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, base + '/' + f, out);
    else if (f.endsWith('.md')) out.push(base + '/' + f);
  }
};
const files = []; walk(ZH, '', files);
for (const rel of files) {
  const z = fs.readFileSync(path.join(ZH, rel), 'utf8');
  let inCode = false;
  for (const ln of z.split(/\r?\n/)) {
    if (/^```/.test(ln)) { inCode = !inCode; continue; }
    if (inCode) continue;
    const m = ln.match(/^(#{1,6}) (.+)$/);
    if (!m) continue;
    const t = m[2].trim();
    // 纯英文(无中文字符)且不是纯大写缩写/产品名单词
    if (!/[一-鿿]/.test(t) && /[a-z]/.test(t)) {
      issues.push(rel + ' :: ' + ln.slice(0, 80));
    }
  }
}
console.log('真·英文标题数:', issues.length);
issues.forEach(i => console.log(i));
