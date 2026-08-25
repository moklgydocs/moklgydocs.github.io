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

  async function clickNav(startRoute, linkText) {
    await win.loadURL('app://localhost' + encodeURI(startRoute));
    await new Promise(r => setTimeout(r, 2500));
    const clicked = await win.webContents.executeJavaScript(`(() => {
      const links = [...document.querySelectorAll('.vp-dropdown-item a, .vp-navbar-item a')];
      const t = links.find(a => a.textContent.includes(${JSON.stringify(linkText)}));
      if (!t) return 'NO-LINK';
      t.click();
      return 'clicked ' + t.textContent.trim().slice(0, 20);
    })()`);
    await new Promise(r => setTimeout(r, 4000));
    const after = await win.webContents.executeJavaScript(`JSON.stringify({ url: location.pathname, h1: document.querySelector('h1') ? document.querySelector('h1').textContent.slice(0,36) : '', has404: document.body.textContent.includes('页面不存在') })`);
    console.log('NAV', startRoute, '->', linkText, '::', clicked, '::', after);
  }

  await clickNav('/AI知识库/', 'AI 工程实战');        // books bundle → ai-eng bundle
  await clickNav('/ai-eng/', '动手学深度学习');       // ai-eng bundle → d2l bundle
  await clickNav('/动手学深度学习/', 'Friends');      // d2l bundle → 语言(main-b) bundle
  await clickNav('/语言/英语/Friends老友记/', 'AI 书籍') === undefined;
  app.quit();
});
