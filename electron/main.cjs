const { app, BrowserWindow, protocol, net } = require('electron');
const path = require('path');
const fs = require('fs');
const { pathToFileURL } = require('url');

const DIST = path.join(__dirname, '..', 'src', '.vuepress', 'dist');

// 注册为标准安全协议,保证 localStorage / fetch 等 Web 能力可用(必须在 ready 前调用)
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: { standard: true, secure: true, supportFetchAPI: true, stream: true, bypassCSP: true },
  },
]);

app.whenReady().then(() => {
  // 用 app:// 协议托管 dist 目录,让 VuePress 生成的绝对路径(/assets/...)正常工作
  protocol.handle('app', (request) => {
    const { pathname } = new URL(request.url);
    const rel = decodeURIComponent(pathname);
    let filePath = path.join(DIST, rel);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }
    if (!fs.existsSync(filePath)) {
      // 无扩展名的路由回退到 SPA 入口;静态资源缺失则返回 404
      if (!path.extname(rel)) {
        filePath = path.join(DIST, 'index.html');
      } else {
        return new Response(null, { status: 404 });
      }
    }
    return net.fetch(pathToFileURL(filePath).toString());
  });

  const win = new BrowserWindow({
    width: 1366,
    height: 900,
    autoHideMenuBar: true,
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  win.loadURL('app://localhost/index.html');
});

app.on('window-all-closed', () => {
  app.quit();
});
