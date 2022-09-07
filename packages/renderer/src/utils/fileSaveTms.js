// 瓦片转换
import { setState } from './progress';
import { downloadLoop, downloadClipLoop } from './download';
import {setMapLoading} from './baseMap.js';

/**
 * 下载TMS瓦片
 */
export class TileTMS {
  constructor(data, apiDownload, apiEnsureDirSync) {
    this.rootPath = data.savePath; // 文件根目录
    this.maxZoom = data.maxZoom;
    this.minZoom = data.minZoom;
    this.mapExtent = data.extent;
    this.imageType = data.imageType;
    // this.projection = data.mapConfig.projection.code; // BAIDU,EPSG:4326,EPSG:3857
    this.urlTemplate = data.mapConfig.config.urlTemplate;
    this.apiEnsureDirSync = apiEnsureDirSync;
    this.titleLayer = data.mapConfig.titleLayer;
    setState(true);
    const list = this.calcTiles();
    if (data.clipImage) {
      downloadClipLoop(list, apiDownload, this.titleLayer, data.downloadGeometry);
    } else {
      downloadLoop(list, apiDownload);
    }
  }
  calcTiles() {
    // 当前绝对路径
    const downloadPath = this.rootPath + '\\';

    // 下载范围
    const zmin = this.minZoom;
    const zmax = this.maxZoom + 1;
    const pictureType = '.' + this.imageType;
    // 遍历URL，获取数据
    const list = [];
    for (let z = zmin; z < zmax; z++) {
      const tileGrids = this.titleLayer._getCascadeTiles(z).tileGrids[0];
      for (let x = 0; x < tileGrids.tiles.length; x++) {
        const tile = tileGrids.tiles[x];
        const temppath = downloadPath + tile.z + '\\' + tile.x;
        this.apiEnsureDirSync(temppath);
        const savePath = temppath + '\\' + tile.y + pictureType;
        list.push({zoom: tile.z, url:tile.url, savePath, x:tile.x, y:tile.y});
      }
    }
    setMapLoading(false);
    return list;
  }
}

/**
 * 下载TMS瓦片集合
 */
export class TileTMSList {
  constructor(data, apiDownload, apiEnsureDirSync) {
    this.rootPath = data.savePath; // 文件根目录
    this.maxZoom = data.maxZoom;
    this.minZoom = data.minZoom;
    this.mapExtent = data.extent;
    this.imageType = data.imageType;
    this.apiEnsureDirSync = apiEnsureDirSync;
    this.titleLayer = data.mapConfig.titleLayer;
    setState(true);

    let list = [];
    data.mapConfig.titleLayer.forEach(layer => {
      list = [...list, ...this.calcTiles(layer.config().style, layer)];
    });
    setMapLoading(false);

    if (data.clipImage) {
      downloadClipLoop(list, apiDownload, this.titleLayer[0], data.downloadGeometry);
    } else {
      downloadLoop(list, apiDownload);
    }
  }
  calcTiles(subpath, layer) {
    // 当前绝对路径
    const downloadPath = this.rootPath + '\\' + subpath + '\\';

    // 下载范围
    const zmin = this.minZoom;
    const zmax = this.maxZoom + 1;
    // 下载地址
    const pictureType = '.' + this.imageType;
    // 遍历URL，获取数据
    const list = [];
    for (let z = zmin; z < zmax; z++) {
      const tileGridsList = layer._getCascadeTiles(z).tileGrids;
      tileGridsList.forEach(tileGrids => {
        for (let x = 0; x < tileGrids.tiles.length; x++) {
          const tile = tileGrids.tiles[x];
          const temppath = downloadPath + tile.z + '\\' + tile.x;
          this.apiEnsureDirSync(temppath);
          const savePath = temppath + '\\' + tile.y + pictureType;
          list.push({zoom: tile.z, url:tile.url, savePath, x:tile.x, y:tile.y});
        }
      });
    }
    return list;
  }
}

/**
 * 下载TMS瓦片集合，合并多张瓦片
 */
 export class TileTMSListMerge {
  constructor(data, apiDownload, apiEnsureDirSync) {
    this.rootPath = data.savePath; // 文件根目录
    this.maxZoom = data.maxZoom;
    this.minZoom = data.minZoom;
    this.mapExtent = data.extent;
    this.imageType = data.imageType;
    this.apiEnsureDirSync = apiEnsureDirSync;
    this.titleLayer = data.mapConfig.titleLayer;
    setState(true);

    const list = this.calcTiles();
    if (data.clipImage) {
      downloadClipLoop(list, apiDownload, this.titleLayer[0], data.downloadGeometry);
    } else {
      downloadLoop(list, apiDownload);
    }
  }
  calcTiles() {
    // 当前绝对路径
    const downloadPath = this.rootPath + '\\';

    // 下载范围
    const zmin = this.minZoom;
    const zmax = this.maxZoom + 1;
    // 下载地址
    const pictureType = '.' + this.imageType;

    const imgLyr = this.titleLayer.find(t => { return !t.config().style.includes('_Label'); });
    const imgLyrLabel = this.titleLayer.find(t => { return t.config().style.includes('_Label'); });
    const storeMap = {};
    for (let z = zmin; z < zmax; z++) {
      const tileGridsList = imgLyr._getCascadeTiles(z).tileGrids;
      tileGridsList.forEach(tileGrids => {
        for (let x = 0; x < tileGrids.tiles.length; x++) {
          const tile = tileGrids.tiles[x];
          const temppath = downloadPath + tile.z + '\\' + tile.x;
          this.apiEnsureDirSync(temppath);
          const savePath = temppath + '\\' + tile.y + pictureType;

          storeMap[`${tile.x}${tile.y}${tile.z}`] = {zoom: tile.z, layers:[
            {
              url: tile.url,
              isLabel: false,
            },
          ], savePath, x:tile.x, y:tile.y};
        }
      });
    }
    for (let z = zmin; z < zmax; z++) {
      const tileGridsList = imgLyrLabel._getCascadeTiles(z).tileGrids;
      tileGridsList.forEach(tileGrids => {
        for (let x = 0; x < tileGrids.tiles.length; x++) {
          const tile = tileGrids.tiles[x];
          storeMap[`${tile.x}${tile.y}${tile.z}`].layers.push({
            url: tile.url,
            isLabel: true,
          });
        }
      });
    }
    setMapLoading(false);
    return Object.values(storeMap);
  }
}
