const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');

let win;

function createWindow () {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    fullscreen: false,        // لكي يظهر شريط الإغلاق والتصغير
    frame: true,              // إبقاء الإطار ليظهر الشريط
    autoHideMenuBar: true,    // إخفاء القوائم (File, Edit...)
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // التأكيد على إخفاء القوائم تماماً
  win.setMenuBarVisibility(false);
  
  // تكبير النافذة لتملا الشاشة
  win.maximize(); 

  win.loadFile('pos-system.html');

  // التحقق من التحديث عند فتح البرنامج
  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// --- نظام التحديث التفاعلي ---
autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox(win, {
    type: 'info',
    title: 'تحديث جديد متاح',
    message: 'يوجد تحديث جديد لنظام مبيعات مثلث. هل تود تحميله الآن؟',
    buttons: ['نعم', 'لا']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.downloadUpdate();
    }
  });
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "جاري تحميل التحديث: " + Math.round(progressObj.percent) + "%";
  if (win && win.webContents) {
    win.webContents.send('update-message', log_message);
  }
});

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox(win, {
    type: 'question',
    title: 'جاهز للتثبيت',
    message: 'تم تحميل التحديث. هل تود إعادة تشغيل البرنامج وتثبيته الآن؟',
    buttons: ['إعادة تشغيل وتثبيت', 'لاحقاً']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.quitAndInstall();
    }
  });
});
