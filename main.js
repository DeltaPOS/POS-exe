const { app, BrowserWindow, dialog } = require('electron'); // أضفنا dialog
const { autoUpdater } = require('electron-updater');

// ... (باقي كود إنشاء النافذة كما هو)

// عند توفر تحديث، اسأل الزبون
autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox(win, {
    type: 'info',
    title: 'تحديث جديد متاح',
    message: 'يوجد تحديث جديد لنظام مبيعات مثلث. هل تود تحميله الآن؟',
    buttons: ['نعم', 'لا']
  }).then((result) => {
    if (result.response === 0) {
      autoUpdater.downloadUpdate(); // تحميل التحديث إذا ضغط "نعم"
    }
  });
});

// إظهار شريط التقدم للزبون أثناء التحميل
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "جاري تحميل التحديث: " + Math.round(progressObj.percent) + "%";
  win.webContents.send('update-message', log_message); // إرسال رسالة للواجهة
});

// عند انتهاء التحميل، اسأل الزبون للبدء بالتثبيت
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
