const { app, BrowserWindow } = require('electron');
const { autoUpdater } = require('electron-updater');

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.loadFile('pos-system.html');

  // فحص التحديثات
  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.whenReady().then(createWindow);

// التعامل مع التحديثات
autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall();
});
