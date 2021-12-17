// 在主进程中.
const { ipcMain } = require('electron');
const { dialog } = require('electron');
// const request = require('request');
// const fs = require('fs');
const fse = require('fs-extra');

ipcMain.handle('show-dialog', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] });
  return result;
});
// 下载并保存图片
// ipcMain.on('save-image', (event, args) => {
//   request(args.url).pipe(fs.createWriteStream(args.savePath));
// });
// 确保目录存在，不存在则创建
ipcMain.on('ensure-dir', (event, args) => {
  fse.ensureDirSync(args);
});


// 下载事件
export function ipcHandle(win) {
  let currentConfig = null;
  ipcMain.on('save-image', (event, item) => {
    currentConfig = item;
    win.webContents.downloadURL(currentConfig.url);
  });
  win.webContents.session.on('will-download', (event, item) => {
    const savePath = currentConfig.savePath;
    // 设置下载目录，阻止系统dialog的出现
    item.setSavePath(savePath);
    // 下载任务完成
    item.once('done', (e, state) => {
      win.webContents.postMessage('imageDownloadDone', {
        state,
      });
    });
  });
}
