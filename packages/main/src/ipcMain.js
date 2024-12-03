// 在主进程中.
const { ipcMain } = require('electron');
const { dialog } = require('electron');
const fse = require('fs-extra');
const fs = require('fs');
const sharp = require('sharp');
const request = require('superagent');
const path = require('path');
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

  // superagent & sharp 下载图片
  ipcMain.on('save-image', (event, args) => {
    // sharp(base64Data).composite 反过来试试
    const savePath = path.normalize(args.savePath);
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
          .toFile(savePath),
      );
    } else {
      promises.push(
        sharpStream
          // .ensureAlpha()
          .toFile(savePath),
      );
    }

    // got.stream(args.url).pipe(sharpStream);
    // TODO 下载天地图瓦片报错 Input buffer contains unsupported image format
    requestHandle(request.get(args.url)).pipe(sharpStream);
    Promise.all(promises)
      .then(() => {
        win.webContents.send('imageDownloadDone', {
          state: 'completed',
        });
      })
      .catch((err) => {
        console.error('错误', err);
        try {
          fs.unlinkSync(savePath);
        } catch {
          // do nothing
        }
        win.webContents.send('imageDownloadDone', {
          state: 'error',
        });
      });
  });

  // superagent & sharp 下载、合并图片
  ipcMain.on('save-image-merge', (event, args) => {
    try {
      const savePath = path.normalize(args.savePath);
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
          .toFile(savePath)
          .then(() => {
            win.webContents.send('imageDownloadDone', {
              state: 'completed',
            });
          })
          .catch((err) => {
            console.error('错误', err);
            try {
              fs.unlinkSync(savePath);
            } catch (e) {
              // do nothing
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
