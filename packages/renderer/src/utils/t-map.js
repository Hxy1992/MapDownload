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
      zoomControl : true, // 缩放控件
      scaleControl : true, // 比例尺控件
      fog: false,
    });
    this.map = map;
    this.switchBaseLayer(defaultMap());
  }
  switchBaseLayer(param) {
    const methodName = 'get' + param.parent + 'TileLayer';
    const style = param.layer.value;
    const baseLayer = TileLayerCollection[methodName](param.parent + '-' + style, {
      style: style,
      ...defaultTileOption,
      // subdomains: param.layer.subdomains,
      // attribution: param.layer.attribution,
      ...param.layer.exteral,
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
    this.map.setCursor('crosshair');
  }
  // 结束绘制
  endDraw() {
    if (this._drawLayer) {
      this._drawLayer.clear();
      this._drawTool.disable();
      this.map.resetCursor();
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
      const layers = baseMap.layers;
      return {
        config: layers.map(temp => {return temp.config();}),
        projection: baseMap.getProjection(),
        titleLayer: layers,
      };
    } else {
      return {
        config: baseMap.config(),
        projection: baseMap.getProjection(),
        titleLayer: baseMap,
      };
    }
  }
}

export default TMap;
