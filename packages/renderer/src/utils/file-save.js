// 地图
import {TileTMS, TileTMSList, TileTMSListMerge} from './tile-tms';
import TileBaidu from './tile-baidu';
import { getState } from './progress';
class FileSave{
  constructor(data) {
    const projection = data.mapConfig.projection.code; // BAIDU,EPSG:4326,EPSG:3857
    if (getState()) {
      return alert('下载任务执行中，请稍后..');
    }
    if (projection === 'BAIDU') {
      this.downloadBaidu(data);
    } else {
      this.downloadTms(data);
    }
  }
  // 保存单张图片
  saveImage(param) {
    // const param = {
    //   url: 'https://map.geoq.cn/MapServer/tile/9/207/421',
    //   savePath: '',
    // };
    window.electron.ipcRenderer.send('save-image', param);

  }
  // 保存图片并合并
  saveImagesAndMerge(param) {
    // const param = {
    //   urls: ['https://map.geoq.cn/MapServer/tile/9/207/421','https://map.geoq.cn/MapServer/tile/9/207/421'],
    //   savePath: '',
    // };
    window.electron.ipcRenderer.send('save-image-merge', param);

  }
  ensureDirSync(path) {
    window.electron.ipcRenderer.send('ensure-dir', path);
  }
  downloadTms(data) {
    if (Array.isArray(data.mapConfig.titleLayer) && data.mapConfig.titleLayer.length > 1) {
      if (data.mergeLayers) {
        new TileTMSListMerge(data, this.saveImage, this.ensureDirSync);
      } else {
        new TileTMSList(data, this.saveImage, this.ensureDirSync);
      }
    } else {
      new TileTMS(data, this.saveImage, this.ensureDirSync);
    }

  }
  downloadBaidu(data) {
    new TileBaidu(data, this.saveImage, this.ensureDirSync);
  }
}

export default FileSave;
