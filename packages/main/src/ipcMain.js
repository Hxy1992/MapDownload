// 在主进程中.
const { ipcMain } = require('electron');
const { dialog } = require('electron');

ipcMain.handle('show-dialog', async () => {
  const list = await dialog.showOpenDialog({ properties: ['openFile', 'openDirectory'] });
  return list;
});
