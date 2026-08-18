const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true, 
      contextIsolation: false 
    }
  });

  win.maximize();
  // تأكد من أن مسار ملف واجهة نقطة البيع (POS) صحيح
  win.loadFile('pos-system.html'); 

  // بدء التحقق من التحديثات بمجرد أن تكون النافذة جاهزة للعرض
  win.once('ready-to-show', () => {
    autoUpdater.checkForUpdatesAndNotify();
  });
}

app.whenReady().then(createWindow);

// ==========================================
// إعدادات التحديث التلقائي (Auto Updater)
// ==========================================

// 1. عند بدء البحث عن تحديثات
autoUpdater.on('checking-for-update', () => {
  if (win) win.webContents.send('update-message', 'جاري البحث عن تحديثات...');
});

// 2. عند العثور على تحديث
autoUpdater.on('update-available', (info) => {
  if (win) win.webContents.send('update-message', 'تم العثور على تحديث جديد. جاري التحميل...');
});

// 3. في حال عدم وجود تحديث
autoUpdater.on('update-not-available', (info) => {
  if (win) win.webContents.send('update-message', 'النظام محدث لآخر إصدار.');
});

// 4. معالجة الأخطاء (الحل الجذري لمعرفة سبب توقف التحديث وعدم تعليقه بصمت)
autoUpdater.on('error', (error) => {
  let log_message = "حدث خطأ أثناء التحديث: " + (error == null ? "خطأ مجهول" : (error.stack || error).toString());
  if (win) win.webContents.send('update-message', log_message);
  console.error(log_message);
});

// 5. تتبع نسبة التحميل وإرسالها للواجهة الأمامية
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = `سرعة التحميل: ${progressObj.bytesPerSecond} - تم تحميل ${progressObj.percent}%`;
  if (win) win.webContents.send('download-progress', progressObj.percent);
});

// 6. عند اكتمال التحميل والوصول إلى 100% (حل مشكلة التعليق والنافذة المخفية)
autoUpdater.on('update-downloaded', (info) => {
  if (win) win.webContents.send('update-message', 'تم اكتمال التحميل بنسبة 100%. في انتظار التأكيد للتثبيت.');

  const dialogOpts = {
    type: 'info',
    buttons: ['إعادة التشغيل والتثبيت الآن', 'لاحقاً'],
    title: 'تحديث نظام المبيعات',
    message: 'إصدار جديد متاح للتثبيت',
    detail: 'تم تنزيل الإصدار الجديد بالكامل. هل تريد إغلاق النظام الآن لتثبيته؟'
  };

  // ربط النافذة المنبثقة بالنافذة الرئيسية (win) لضمان عدم ظهورها في الخلفية
  dialog.showMessageBox(win, dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) {
      // المعامل الأول: false (لإظهار واجهة التثبيت للمستخدم وعدم جعله صامتاً تماماً)
      // المعامل الثاني: true (لإعادة تشغيل التطبيق تلقائياً بعد الانتهاء من التثبيت)
      autoUpdater.quitAndInstall(false, true);
    }
  });
});

// ==========================================
// أحداث إغلاق التطبيق
// ==========================================

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
