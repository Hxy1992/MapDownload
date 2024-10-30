// 下载
import { setState, setProgress } from './progress';
// eslint-disable-next-line
import { judgeTile, testDraw2 } from './baseMap';
import { ClipImage } from './clipImage';
const CLIPIMAGE = new ClipImage();
/**
 * 下载瓦片
 * @param {Array} list 瓦片列表
 * @param {Function} apiDownload 下载方法
 * @returns
 */
export function downloadLoop (list, apiDownload) {

  if (!Array.isArray(list) || typeof apiDownload !== 'function') return;
  const length = list.length;
  if (length === 0) return;

  const statistics = {success: 0, error: 0, percentage: 0, count: length};
  let index = 0;
  const download = () => {
    if (index >= length) {
      statistics.percentage = 100;
      setProgress(statistics);
      setState(false);
      window.$message.success(`下载完成。下载成功${statistics.success}，下载失败${statistics.error}`);
      return;
    }
    const item = list[index];
    statistics.percentage = Number((index / length * 100).toFixed(2));
    apiDownload(item);
    index++;
  };
  download();
  window.electron.imageDownloadDone(state => {
    if (state.state === 'completed') {
      statistics.success++;
    } else {
      statistics.error++;
    }
    setProgress(statistics);
    download();
  });
}

/**
 * 下载瓦片并裁切
 * @param {Array} list 瓦片列表
 * @param {Function} apiDownload 下载方法
 * @param {maptalks.TileLayer} tileLayer 下载瓦片图层
 * @param {maptalks.Geometry} downloadGeometry 下载范围
 * @param {String} imageType 瓦片格式
 * @returns
 */
export function downloadClipLoop (list, apiDownload, tileLayer, downloadGeometry, imageType) {
  if (!Array.isArray(list) || typeof apiDownload !== 'function') return;
  const length = list.length;
  if (length === 0) return;

  // 获取坐标投影信息
  const { width, height } = tileLayer.getTileSize();
  const spatialReference = tileLayer.getSpatialReference();
  const prj = spatialReference.getProjection();
  const fullExtent = spatialReference.getFullExtent();
  const code = prj.code;
  const statistics = {success: 0, error: 0, percentage: 0, count: length};
  let index = 0;
  const download = async () => {
    if (index >= length) {
      statistics.percentage = 100;
      setProgress(statistics);
      setState(false);
      window.$message.success(`下载完成。下载成功${statistics.success}，下载失败${statistics.error}`);
      return;
    }
    const item = list[index];
    statistics.percentage = Number((index / length * 100).toFixed(2));
    const relation = judgeTile(downloadGeometry, {
      width,
      height,
      spatialReference,
      prj,
      fullExtent,
      code,
      tile: {x:item.x, y:item.y,z:item.zoom},
    });
    if (relation === 1) {
      apiDownload(item);
      index++;
    } else if (relation === 2) {
      index++;
      statistics.success++;
      setProgress(statistics);
      download();
    } else if (typeof relation === 'object') {
      // testDraw2(tileLayer, relation.intersection);
      // 裁切下载
      CLIPIMAGE.addTempGeometry(relation.intersection, relation.rect);
      const imageBuffer = await CLIPIMAGE.getImage(imageType);
      item.imageBuffer = imageBuffer;
      apiDownload(item);
      index++;
    }
  };
  download();
  window.electron.imageDownloadDone(state => {
    if (state.state === 'completed') {
      statistics.success++;
    } else {
      statistics.error++;
    }
    setProgress(statistics);
    download();
  });
}

/**
 * 下载单张瓦片
 * @param {*} tile 瓦片参数
 * @param {*} downloadOption 下载参数
 * @returns Promise
 */
export function downloadImage (tile, downloadOption) {
  const { clipImage } = downloadOption;
  if (clipImage) {
    return _downloadClipImage(tile, downloadOption);
  } else {
    return _downloadImage(tile, downloadOption);
  }
}

/**
 * 下载单张瓦片
 * @param {*} tile
 * @param {*} downloadOption
 * @returns
 */
function _downloadImage (tile, downloadOption) {
  return new Promise((resolve) => {

    const temppath = downloadOption.downloadPath + tile.z + '/' + tile.x;
    window.electron.ipcRenderer.send('ensure-dir', temppath);
    const savePath = temppath + '/' + tile.y + downloadOption.pictureType;
    const param = {zoom: tile.z, url:tile.url, savePath, x:tile.x, y:tile.y};

    window.electron.ipcRenderer.send('save-image', param);
    window.electron.imageDownloadDone(state => {
      if (state.state === 'completed') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

/**
 * 下载单张瓦片并裁切
 * @param {*} tile
 * @param {*} downloadOption
 * @returns
 */
function _downloadClipImage (tile, downloadOption) {
  return new Promise((resolve) => {
    const { tileLayer, downloadGeometry, pictureType, downloadPath, imageType } = downloadOption;
    // 获取坐标投影信息
    const { width, height } = tileLayer.getTileSize();
    const spatialReference = tileLayer.getSpatialReference();
    const prj = spatialReference.getProjection();
    const fullExtent = spatialReference.getFullExtent();
    const code = prj.code;

    const apiDownload = (temp, imageBuffer) => {
      const temppath = downloadPath + temp.z + '/' + temp.x;
      window.electron.ipcRenderer.send('ensure-dir', temppath);
      const savePath = temppath + '/' + temp.y + pictureType;
      const param = {zoom: temp.z, url:temp.url, savePath, x:temp.x, y:temp.y, imageBuffer};
      window.electron.ipcRenderer.send('save-image', param);
    };

    const item = tile;
    const relation = judgeTile(downloadGeometry, {
      width,
      height,
      spatialReference,
      prj,
      fullExtent,
      code,
      tile: {x:item.x, y:item.y,z:item.zoom || item.z},
    });
    if (relation === 1) {
      apiDownload(item);
    } else if (relation === 2) {
      resolve(true);
      return;
    } else if (typeof relation === 'object') {
      // testDraw2(tileLayer, relation.intersection);
      // 裁切下载
      CLIPIMAGE.addTempGeometry(relation.intersection, relation.rect);
      CLIPIMAGE.getImage(imageType).then(imageBuffer => {
        apiDownload(item, imageBuffer);
      });
    }

    window.electron.imageDownloadDone(state => {
      if (state.state === 'completed') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}
