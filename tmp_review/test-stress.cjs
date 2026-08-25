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

  async function state(tag) {
    const s = await win.webContents.executeJavaScript(`JSON.stringify({ url: location.pathname.slice(0,60), h1: document.querySelector('h1') ? document.querySelector('h1').textContent.slice(0,30) : '', has404: document.body.textContent.includes('页面不存在') })`);
    console.log(tag, s);
  }
  async function clickLink(text) {
    return win.webContents.executeJavaScript(`(() => {
      const links = [...document.querySelectorAll('.vp-dropdown-item a, .vp-navbar-item a, .vp-sidebar a')];
      const t = links.find(a => a.textContent.includes(${JSON.stringify(text)}));
      if (!t) return 'NO-LINK:' + ${JSON.stringify(text)};
      t.click(); return 'ok';
    })()`);
  }

  await win.loadURL('app://localhost/index.html');
  await new Promise(r => setTimeout(r, 3000));
  await state('HOME');

  // 往返压力:主页 ⇄ AI知识库 三次
  for (let i = 1; i <= 3; i++) {
    console.log('round', i, await clickLink('AI 知识库'));
    await new Promise(r => setTimeout(r, 3500));
    await state('  ->AI知识库#' + i);
    await win.webContents.executeJavaScript('history.back()');
    await new Promise(r => setTimeout(r, 2500));
    await state('  <-back#' + i);
  }
  // 跨四专栏链式跳
  for (const [txt, tag] of [['AI 工程实战', 'ai-eng'], ['动手学深度学习', 'd2l'], ['从零构建智能体', 'hello-agents'], ['深入理解 AI Agent', 'agent-book']]) {
    console.log('jump', tag, await clickLink(txt));
    await new Promise(r => setTimeout(r, 4000));
    await state('  ->' + tag);
  }
  app.quit();
});
