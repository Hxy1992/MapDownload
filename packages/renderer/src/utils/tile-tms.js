// 瓦片转换

// 经纬度转瓦片行列号
function long2tile(lon, zoom) {
  return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom)));
}

// 经纬度转瓦片行列号Google
function lat2tileGoogle(lat, zoom) {
  return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom)));
}
// 经纬度转瓦片行列号TMS
// function lat2tile(lat, zoom) {
//   return ((1 << zoom) - (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))) - 1);
// }
class TileTMS {
  constructor(data, apiDownload, apiEnsureDirSync) {
    this.apiDownload = apiDownload;
    this.rootPath = data.savePath; // 文件根目录
    this.maxZoom = data.maxZoom;
    this.minZoom = data.minZoom;
    this.mapExtent = data.extent;
    this.projection = data.mapConfig.projection.code; // BAIDU,EPSG:4326,EPSG:3857
    this.urlTemplate = data.mapConfig.config.urlTemplate; // BAIDU,EPSG:4326,EPSG:3857
    this.apiEnsureDirSync = apiEnsureDirSync;
    this.download();
  }
  download() {
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
    const baseUrl = this.urlTemplate;
    const pictureType = '.png';
    // 下载统计
    let img_count = 0;
    let img_success = 0;
    let img_error = 0;
    // 遍历URL，获取数据

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
      let temp_count = 1;
      let temp_level_pro = '正在下载瓦片层级：' + z + '/' + zmax;
      console.log(temp_level_pro);
      for (let x = minLong; x < maxLong; x++) {
        const temppath = downloadPath + z + '\\' + x;
        this.apiEnsureDirSync(temppath);
        for (let y = minLat; y < maxLat; y++) {
          const str3 = baseUrl.replace('{z}', z).replace('{x}', x).replace('{y}', y);
          const path2 = temppath + '\\' + y + pictureType;
          img_count = img_count + 1;
          try {
            this.apiDownload({url:str3, savePath:path2});
            temp_count = temp_count + 1;
          }
          catch (e) {
            img_error = img_error + 1;
            console.error(e);
          }
        }
      }
    }

    img_success = img_count - img_error;

    console.log('***********************************');
    console.log('下载完成:');
    console.log('瓦片总数：'+ (img_count));
    console.log('下载成功：'+ (img_success));
    console.log('下载失败：'+ (img_error));
    console.log('***********************************');
  }
}

export default TileTMS;
