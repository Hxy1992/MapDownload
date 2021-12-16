// 在主进程中.
const { ipcMain } = require('electron');
const { dialog } = require('electron');
const request = require('request');
const fs = require('fs');
const fse = require('fs-extra');

ipcMain.handle('show-dialog', async () => {
  const list = await dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] });
  return list;
});
// 下载并保存图片
ipcMain.on('save-image', (event, args) => {
  request(args.url).pipe(fs.createWriteStream(args.savePath));

  // 异步
  // var writeStream = fs.createWriteStream('image.png');
  // var readStream = request(src)
  // readStream.pipe(writeStream);
  // readStream.on('end', function(response) {
  //     console.log('文件写入成功');
  //     writeStream.end();
  // });

  // writeStream.on("finish", function() {
  //     console.log("ok");
  // });
});
// 确保目录存在，不存在则创建
ipcMain.on('ensure-dir', (event, args) => {
  fse.ensureDirSync(args);

  // 改成异步

});
