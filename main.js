const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    // إخفاء القوائم والشاشة الكاملة
    autoHideMenuBar: true, 
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // التأكيد على إخفاء شريط القوائم العلوي تماماً
  win.setMenuBarVisibility(false);

  win.loadFile('pos-system.html');

  // فحص التحديثات
  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.whenReady().then(createWindow);

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
