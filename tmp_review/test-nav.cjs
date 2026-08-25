const { app, BrowserWindow, protocol, net } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const DIST = path.join(__dirname, '..', 'src', '.vuepress', 'dist');

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true, bypassCSP: true } },
]);

app.whenReady().then(async () => {
  protocol.handle('app', (request) => {
    const { pathname } = new URL(request.url);
    const rel = decodeURIComponent(pathname);
    let filePath = path.join(DIST, rel);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) filePath = path.join(filePath, 'index.html');
    if (!fs.existsSync(filePath)) {
      if (!path.extname(rel)) filePath = path.join(DIST, 'index.html');
      else return new Response(null, { status: 404 });
    }
    return net.fetch(pathToFileURL(filePath).toString());
  });

  const win = new BrowserWindow({ show: false, width: 1366, height: 900, webPreferences: { contextIsolation: true, nodeIntegration: false } });
  await win.loadURL('app://localhost/index.html');
  await new Promise(r => setTimeout(r, 3000));

  // 1) 找到 navbar 里 AI书籍 下拉并列出其链接
  const navInfo = await win.webContents.executeJavaScript(`(() => {
    const dds = [...document.querySelectorAll('.vp-dropdown-wrapper')].map(w => {
      const t = w.querySelector('.vp-dropdown-title') ? w.querySelector('.vp-dropdown-title').textContent.trim() : '';
      const ls = [...w.querySelectorAll('.vp-dropdown-item a')].map(a => a.textContent.trim() + ' -> ' + a.getAttribute('href'));
      return t + ' :: ' + ls.join(' ; ');
    });
    return JSON.stringify(dds);
  })()`);
  console.log('NAV-DROPDOWNS:', navInfo);

  // 2) 点击 AI书籍 下拉里的"AI 知识库"链接,验证落地
  const clicked = await win.webContents.executeJavaScript(`(() => {
    const links = [...document.querySelectorAll('.vp-dropdown-item a')];
    const target = links.find(a => a.textContent.includes('AI 知识库')) || links.find(a => (a.getAttribute('href')||'').includes('AI'));
    if (!target) return 'NO-LINK-FOUND';
    target.click();
    return 'clicked: ' + target.textContent.trim() + ' href=' + target.getAttribute('href');
  })()`);
  console.log('CLICK:', clicked);
  await new Promise(r => setTimeout(r, 4000));
  const after = await win.webContents.executeJavaScript(`JSON.stringify({ url: location.href, title: document.title.slice(0,40), h1: document.querySelector('h1') ? document.querySelector('h1').textContent.slice(0,40) : '', has404: document.body.textContent.includes('页面不存在') })`);
  console.log('AFTER-NAV:', after);

  // 3) 在 AI知识库 页面点一个侧栏链接(专栏内 SPA 翻页)
  const click2 = await win.webContents.executeJavaScript(`(() => {
    const links = [...document.querySelectorAll('.vp-sidebar a')].filter(a => (a.getAttribute('href')||'').includes('html'));
    if (!links.length) return 'NO-SIDEBAR-LINKS';
    links[0].click();
    return 'clicked sidebar: ' + links[0].textContent.trim().slice(0,30);
  })()`);
  console.log('CLICK2:', click2);
  await new Promise(r => setTimeout(r, 3500));
  const after2 = await win.webContents.executeJavaScript(`JSON.stringify({ url: location.href, h1: document.querySelector('h1') ? document.querySelector('h1').textContent.slice(0,40) : '', has404: document.body.textContent.includes('页面不存在') })`);
  console.log('AFTER-NAV2:', after2);

  app.quit();
});
