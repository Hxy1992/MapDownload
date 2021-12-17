// 地图
import * as maptalks from 'maptalks';
import TileLayerCollection from './TileLayerCollection/TileLayerCollection';
import {defaultMap} from './layer-list';

const defaultTileOption = {
  maxCacheSize: 1000,
  tileRetryCount: 3, // 失败重试次数
  cascadeTiles: false,
  renderer: 'gl', // gl/canvas gl瓦片需跨域支持；canvas不需要
  debug: false, // 绘制瓦片边框
  crossOrigin: null, // 瓦片跨域
  repeatWorld: false,
};
class TMap{
  constructor(id) {
    this.createMap(id);
  }
  createMap(id) {
    const map = new maptalks.Map(id, {
      center: [105.08052356963802, 36.04231948670001],
      zoom: 5,
      minZoom:1,
      maxZoom:19,
      // spatialReference:{
      //   projection : 'baidu',
      // },
      // baseLayer: new maptalks.TileLayer('base', {
      //   'urlTemplate' : 'https://gss{s}.bdstatic.com/8bo_dTSlRsgBo1vgoIiO_jowehsv/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20170927',
      //   'subdomains':[0, 1, 2, 3],
      //   ...defaultTileOption,
      // }),
      // attribution: true,
    });
    this.map = map;
    this.switchBaseLayer(defaultMap());
  }
  switchBaseLayer(param) {
    const methodName = 'get' + param.parent + 'TileLayer';
    const style = param.layer.value;
    const baseLayer = TileLayerCollection[methodName](param.parent + '-' + style, {
      style: style,
      subdomains: param.layer.subdomains,
      attribution: param.layer.attribution,
      ...defaultTileOption,
    });
    this.map.removeBaseLayer(this.map.getBaseLayer());
    this.map.setBaseLayer(baseLayer);
    this.map.setSpatialReference({
      projection : param.layer.prejection,
    });
  }
  // 绘制矩形、编辑矩形位置
  startDraw() {
    const map = this.map;
    const isFirst = typeof this._drawLayer === 'undefined';
    if (isFirst) {
      const layer = new maptalks.VectorLayer('vector').addTo(map);
      this._drawLayer = layer;
      const drawTool = new maptalks.DrawTool({
        mode: 'Rectangle',
        symbol : {
        'lineColor' : '#1296db',
        'lineWidth' : 3,
        },
      }).addTo(map).enable();
      this._drawTool = drawTool;
      // eslint-disable-next-line
      drawTool.on('drawstart', function (param) {
        layer.clear();
      });
      drawTool.on('drawend', function (param) {
        layer.addGeometry(param.geometry);
      });
    } else {
      const drawTool = this._drawTool;
      drawTool.enable();
    }
  }
  // 结束绘制
  endDraw() {
    if (this._drawLayer) {
      this._drawLayer.clear();
      this._drawTool.disable();
    }
  }
  // 获取下载范围
  getDownloadExtent() {
    if (!this._drawLayer || this._drawLayer.getCount() !== 1) return null;
    return this._drawLayer.getGeometries()[0].getExtent();
  }
  // 获取瓦片图层参数
  getBaseMapConfig() {
    const baseMap = this.map.getBaseLayer();
    if (baseMap instanceof maptalks.GroupTileLayer) {
      const layer = baseMap.layers[0];
      return {
        config: layer.config(),
        projection: baseMap.getProjection(),
      };
    } else {
      return {
        config: baseMap.config(),
        projection: baseMap.getProjection(),
      };
    }
  }
}

export default TMap;
