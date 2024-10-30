// 瓦片转换
import { setState } from './progress';
import { downloadLoop } from './download';
// 经纬度转瓦片行列号
function long2tile(lon, zoom) {
  return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}

// 经纬度转瓦片行列号Google
// eslint-disable-next-line
function lat2tileGoogle(lat, zoom) {
  return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}
// 经纬度转瓦片行列号TMS
// eslint-disable-next-line
function lat2tileTMS(lat, zoom) {
  return ((1 << zoom) - (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))) - 1);
}
/**
 * 下载TMS瓦片
 */
export class TileTMS {
  constructor(data, apiDownload, apiEnsureDirSync) {
    this.apiDownload = apiDownload;
    this.rootPath = data.savePath; // 文件根目录
    this.maxZoom = data.maxZoom;
    this.minZoom = data.minZoom;
    this.mapExtent = data.extent;
    // this.projection = data.mapConfig.projection.code; // BAIDU,EPSG:4326,EPSG:3857
    this.urlTemplate = data.mapConfig.config.urlTemplate;
    this.apiEnsureDirSync = apiEnsureDirSync;
    this.tileLayer = data.mapConfig.tileLayer;
    setState(true);
    downloadLoop(this.calcTiles(), this.apiDownload);
  }
  calcTiles() {
    // 当前绝对路径
    const downloadPath = this.rootPath + '/';

    // 下载范围
    const zmin = this.minZoom;
    const zmax = this.maxZoom + 1;
    const south_edge = this.mapExtent.ymin;
    const north_edge = this.mapExtent.ymax;
    const west_edge = this.mapExtent.xmin;
    const east_edge = this.mapExtent.xmax;
    // 下载地址
    // const baseUrl = this.urlTemplate;
    const pictureType = '.png';
    // 遍历URL，获取数据
    const list = [];
    for (let z = zmin; z < zmax; z++) {
      const top_tile = lat2tileGoogle(north_edge, z);
      const left_tile = long2tile(west_edge, z);
      const bottom_tile = lat2tileGoogle(south_edge, z);
      const right_tile = long2tile(east_edge, z);
      const minLong = Math.min(left_tile, right_tile);
      const maxLong = Math.max(left_tile, right_tile);
      let minLat = Math.min(bottom_tile, top_tile);
      if (minLat < 0) minLat = 0;
      const maxLat = Math.max(bottom_tile, top_tile);
      for (let x = minLong; x < maxLong; x++) {
        const temppath = downloadPath + z + '/' + x;
        this.apiEnsureDirSync(temppath);
        for (let y = minLat; y < maxLat; y++) {
          // const str3 = baseUrl.replace('{z}', z).replace('{x}', x).replace('{y}', y);
          const str3 = this.tileLayer.getTileUrl(x, y, z);
          const path2 = temppath + '/' + y + pictureType;
          list.push({zoom: z, url:str3, savePath:path2});
        }
      }
    }
    return list;
  }
}

/**
 * 下载TMS瓦片集合
 */
export class TileTMSList {
  constructor(data, apiDownload, apiEnsureDirSync) {
    this.apiDownload = apiDownload;
    this.rootPath = data.savePath; // 文件根目录
    this.maxZoom = data.maxZoom;
    this.minZoom = data.minZoom;
    this.mapExtent = data.extent;
    this.apiEnsureDirSync = apiEnsureDirSync;
    this.tileLayer = data.mapConfig.tileLayer;
    setState(true);

    let list = [];
    data.mapConfig.tileLayer.forEach(layer => {
      list = [...list, ...this.calcTiles(layer.config().style, layer)];
    });
    downloadLoop(list, this.apiDownload);
  }
  calcTiles(subpath, layer) {
    // 当前绝对路径
    const downloadPath = this.rootPath + '/' + subpath + '/';

    // 下载范围
    const zmin = this.minZoom;
    const zmax = this.maxZoom + 1;
    const south_edge = this.mapExtent.ymin;
    const north_edge = this.mapExtent.ymax;
    const west_edge = this.mapExtent.xmin;
    const east_edge = this.mapExtent.xmax;
    // 下载地址
    const pictureType = '.png';
    // 遍历URL，获取数据
    const list = [];
    for (let z = zmin; z < zmax; z++) {
      const top_tile = lat2tileGoogle(north_edge, z);
      const left_tile = long2tile(west_edge, z);
      const bottom_tile = lat2tileGoogle(south_edge, z);
      const right_tile = long2tile(east_edge, z);
      const minLong = Math.min(left_tile, right_tile);
      const maxLong = Math.max(left_tile, right_tile);
      let minLat = Math.min(bottom_tile, top_tile);
      if (minLat < 0) minLat = 0;
      const maxLat = Math.max(bottom_tile, top_tile);
      for (let x = minLong; x < maxLong; x++) {
        const temppath = downloadPath + z + '/' + x;
        this.apiEnsureDirSync(temppath);
        for (let y = minLat; y < maxLat; y++) {
          const str3 = layer.getTileUrl(x, y, z);
          const path2 = temppath + '/' + y + pictureType;
          list.push({zoom: z, url:str3, savePath:path2});
        }
      }
    }
    return list;
  }
}

/**
 * 下载TMS瓦片集合，合并多张瓦片
 */
 export class TileTMSListMerge {
  constructor(data, apiDownload, apiEnsureDirSync) {
    this.apiDownload = apiDownload;
    this.rootPath = data.savePath; // 文件根目录
    this.maxZoom = data.maxZoom;
    this.minZoom = data.minZoom;
    this.mapExtent = data.extent;
    this.apiEnsureDirSync = apiEnsureDirSync;
    this.tileLayer = data.mapConfig.tileLayer;
    setState(true);

    downloadLoop(this.calcTiles(data.mapConfig.tileLayer), this.apiDownload);
  }
  calcTiles(layers) {
    // 当前绝对路径
    const downloadPath = this.rootPath + '/';

    // 下载范围
    const zmin = this.minZoom;
    const zmax = this.maxZoom + 1;
    const south_edge = this.mapExtent.ymin;
    const north_edge = this.mapExtent.ymax;
    const west_edge = this.mapExtent.xmin;
    const east_edge = this.mapExtent.xmax;
    // 下载地址
    const pictureType = '.png';
    // 遍历URL，获取数据
    const list = [];
    for (let z = zmin; z < zmax; z++) {
      const top_tile = lat2tileGoogle(north_edge, z);
      const left_tile = long2tile(west_edge, z);
      const bottom_tile = lat2tileGoogle(south_edge, z);
      const right_tile = long2tile(east_edge, z);
      const minLong = Math.min(left_tile, right_tile);
      const maxLong = Math.max(left_tile, right_tile);
      let minLat = Math.min(bottom_tile, top_tile);
      if (minLat < 0) minLat = 0;
      const maxLat = Math.max(bottom_tile, top_tile);
      for (let x = minLong; x < maxLong; x++) {
        const temppath = downloadPath + z + '/' + x;
        this.apiEnsureDirSync(temppath);
        for (let y = minLat; y < maxLat; y++) {
          const str3 = layers.map(ll => {return {url: ll.getTileUrl(x, y, z), isLabel: ll.config().style.includes('_Label')};});
          const path2 = temppath + '/' + y + pictureType;
          list.push({zoom: z, layers:str3, savePath:path2});
        }
      }
    }
    return list;
  }
}
