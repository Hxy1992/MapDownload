// 瓦片转换
import { setState, setProgress } from './progress';
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
class TileTMS {
  constructor(data, apiDownload, apiEnsureDirSync) {
    this.apiDownload = apiDownload;
    this.rootPath = data.savePath; // 文件根目录
    this.maxZoom = data.maxZoom;
    this.minZoom = data.minZoom;
    this.mapExtent = data.extent;
    // this.projection = data.mapConfig.projection.code; // BAIDU,EPSG:4326,EPSG:3857
    this.urlTemplate = data.mapConfig.config.urlTemplate;
    this.apiEnsureDirSync = apiEnsureDirSync;
    this.titleLayer = data.mapConfig.titleLayer;
    setState(true);
    this.calcTiles();
    this.download();
  }
  calcTiles() {
    // 当前绝对路径
    const downloadPath = this.rootPath + '\\';

    // 下载范围
    // TODO 经纬度为负数时，计算瓦片有问题
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
        const temppath = downloadPath + z + '\\' + x;
        this.apiEnsureDirSync(temppath);
        for (let y = minLat; y < maxLat; y++) {
          // const str3 = baseUrl.replace('{z}', z).replace('{x}', x).replace('{y}', y);
          const str3 = this.titleLayer.getTileUrl(x, y, z);
          const path2 = temppath + '\\' + y + pictureType;
          list.push({zoom: z, url:str3, savePath:path2});
        }
      }
    }
    this.list = list;
  }
  download() {
    let index = 0;
    const length = this.list.length;
    if (length === 0) return;
    const list = this.list;
    const apiDownload = this.apiDownload;
    const statistics = {success: 0, error: 0, percentage: 0, count: length};
    const download = () => {
      if (index >= length) {
        statistics.percentage = 100;
        setProgress(statistics);
        setState(false);
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
}

export default TileTMS;
