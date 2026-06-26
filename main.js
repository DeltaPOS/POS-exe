const { app, BrowserWindow } = require('electron');

function createWindow () {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    autoHideMenuBar: true, // إخفاء القوائم العلوية المزعجة
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.maximize(); // تشغيل البرنامج بملء الشاشة تلقائياً
  win.loadFile('pos-system.html'); // هنا قمنا بربط ملفك الجديد
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

