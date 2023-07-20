// 在主进程中.
const { ipcMain } = require('electron');
const { dialog } = require('electron');
const fse = require('fs-extra');
const fs = require('fs');
const sharp = require('sharp');
const request = require('superagent');
import { requestHandle } from './ipHandle';

ipcMain.handle('show-dialog', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] });
  return result;
});
// 确保目录存在，不存在则创建
ipcMain.on('ensure-dir', (event, args) => {
  fse.ensureDirSync(args);
});


// 下载事件
export function ipcHandle(win) {
  // electron downloadURL方法
  // let currentConfig = null;
  // ipcMain.on('save-image', (event, item) => {
  //   currentConfig = item;
  //   win.webContents.downloadURL(currentConfig.url);
  // });
  // win.webContents.session.on('will-download', (event, item) => {
  //   const savePath = currentConfig.savePath;
  //   // 设置下载目录，阻止系统dialog的出现
  //   item.setSavePath(savePath);
  //   // 下载任务完成
  //   item.once('done', (e, state) => {
  //     win.webContents.send('imageDownloadDone', {
  //       state,
  //     });
  //   });
  // });


  // superagent & sharp 下载图片
  ipcMain.on('save-image', (event, args) => {
    // sharp(base64Data).composite 反过来试试
    const sharpStream = sharp({
      failOnError: false,
    });
    const promises = [];
    if (args.imageBuffer) {
      const base64Data = args.imageBuffer.replace(/^data:image\/\w+;base64,/, '');
      const dataBuffer = Buffer.from(base64Data, 'base64');
      promises.push(
        sharpStream
          .composite([{ input: dataBuffer, gravity: 'centre', blend: 'dest-in' }])
          .toFile(args.savePath),
      );
    } else {
      promises.push(
        sharpStream
          // .ensureAlpha()
          .toFile(args.savePath),
      );
    }

    // got.stream(args.url).pipe(sharpStream);
    requestHandle(request.get(args.url)).pipe(sharpStream);
    Promise.all(promises)
      .then(() => {
        win.webContents.send('imageDownloadDone', {
          state: 'completed',
        });
      })
      .catch(() => {
        // console.error('Error processing files, let\'s clean it up', err);
        try {
          fs.unlinkSync(args.savePath);
        } catch (e) {
          console.error(e);
        }
        win.webContents.send('imageDownloadDone', {
          state: 'error',
        });
      });
  });

  // superagent & sharp 下载、合并图片
  ipcMain.on('save-image-merge', (event, args) => {
    try {
      let imgBack;
      const imgBuffer = [];
      args.layers.forEach(async (item, index) => {
        const sharpStream = sharp({
          failOnError: false,
        });
        requestHandle(request.get(item.url)).pipe(sharpStream);
        const bff = await sharpStream.toBuffer();
        if (item.isLabel) {
          imgBack = bff;
        } else {
          imgBuffer.push(bff);
        }
        // 结束保存
        if (index === args.layers.length - 1) {
          let opration;
          if (args.imageBuffer) {
            const base64Data = args.imageBuffer.replace(/^data:image\/\w+;base64,/, '');
            const dataBuffer = Buffer.from(base64Data, 'base64');
            sharp(imgBack)
            .composite(imgBuffer.map(input => {
              return { input, gravity: 'centre', blend: 'saturate' };
            }))
            .composite([{ input: dataBuffer, gravity: 'centre', blend: 'dest-in' }]);
          } else {
            opration = sharp(imgBack)
            .composite(imgBuffer.map(input => {
              return { input, gravity: 'centre', blend: 'saturate' };
            }));
          }
          opration
          .toFile(args.savePath)
          .then(() => {
            win.webContents.send('imageDownloadDone', {
              state: 'completed',
            });
          })
          .catch(() => {
            try {
              fs.unlinkSync(args.savePath);
            } catch (e) {
              console.error(e);
            }
          });
        }
      });
    } catch {
      win.webContents.send('imageDownloadDone', {
        state: 'error',
      });
    }

  });

}
