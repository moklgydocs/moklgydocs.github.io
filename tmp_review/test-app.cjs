const { app, BrowserWindow, protocol, net } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const DIST = path.join(__dirname, '..', 'src', '.vuepress', 'dist');
const ROUTES = [
  '/index.html',
  '/AI知识库/',
  '/AI知识库/ai-core-concepts.html',
  '/ai-eng/',
  '/ai-eng/00-setup-and-tooling/01-dev-environment.html',
  '/动手学深度学习/',
  '/动手学深度学习/04-预备知识/01-ndarray.html',
  '/深入理解AIAgent/',
  '/从零构建智能体/',
  '/语言/英语/Friends老友记/S01/S01E01.html',
];

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
  const errors = [];
  win.webContents.on('console-message', (e, level, msg) => { if (level >= 3) errors.push(msg.slice(0, 200)); });
  win.webContents.on('render-process-gone', (e, d) => errors.push('RENDER-GONE ' + JSON.stringify(d)));

  for (const route of ROUTES) {
    errors.length = 0;
    try {
      await win.loadURL('app://localhost' + encodeURI(route));
      await new Promise(r => setTimeout(r, 2500));
      const info = await win.webContents.executeJavaScript(`(() => {
        const t = document.title;
        const sb = document.querySelector('.vp-sidebar');
        const links = sb ? [...sb.querySelectorAll('a')].slice(0, 4).map(a => a.textContent.trim().slice(0, 30)) : [];
        const notFound = document.body.textContent.includes('404') && document.body.textContent.length < 2000;
        const h1 = document.querySelector('h1') ? document.querySelector('h1').textContent.trim().slice(0, 40) : '';
        return JSON.stringify({ title: t.slice(0, 50), h1, sidebarLinks: links, notFound });
      })()`);
      console.log('ROUTE', route, '::', info, ':: JS-ERR:', errors.length ? errors.slice(0, 2).join(' | ') : 'none');
    } catch (e) {
      console.log('ROUTE', route, ':: LOAD-FAIL', String(e).slice(0, 120));
    }
  }
  app.quit();
});
