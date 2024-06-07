// 地图
import 'maptalks/dist/maptalks.css';
import * as maptalks from 'maptalks';
import TileLayerCollection from './TileLayerCollection/TileLayerCollection';
import {defaultMap} from './layerList';
import {ref} from 'vue';
import booleanContains from '@turf/boolean-contains';
// import booleanCrosses from '@turf/boolean-crosses';
// import booleanDisjoint from '@turf/boolean-disjoint';
import intersect from '@turf/intersect';
import * as turf from '@turf/helpers';

const defaultTileOption = {
  maxCacheSize: 1000,
  tileRetryCount: 3, // 失败重试次数
  cascadeTiles: false,
  renderer: 'gl', // gl/canvas gl瓦片需跨域支持；canvas不需要
  debug: false, // 绘制瓦片边框
  crossOrigin: null, // 瓦片跨域
  repeatWorld: false,
};
export default class baseMap{
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
      dragRotatePitch: false,
      dragRotate: false,
      dragPitch: false,
    });
    this._vectorLayer = new maptalks.VectorLayer('vector').addTo(map);
    this.map = map;
    this.switchBaseLayer(defaultMap());
  }
  getMap() {
    return this.map;
  }
  // 显示瓦片网格
  showTileGrid(val) {
    const baseLayer = this.map.getBaseLayer();
    baseLayer.config({debug: val});
    baseLayer.hide();
    baseLayer.show();
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
    const oldBaseLayer = this.map.getBaseLayer();
    if (oldBaseLayer && oldBaseLayer.config()?.debug) {
      baseLayer.config({debug: true});
    }
    this.map.removeBaseLayer(oldBaseLayer);
    this.map.setBaseLayer(baseLayer);
    this.map.setSpatialReference({
      projection : param.layer.prejection,
    });

    // testDraw(this.map.getBaseLayer(), {x:24,y:12,z:5}); // 测试-绘制瓦片外框
  }
  // 绘制矩形、编辑矩形位置
  startDraw() {
    const map = this.map;
    const isFirst = typeof this._drawTool === 'undefined';
    if (isFirst) {
      const layer = this._vectorLayer;
      const drawTool = new maptalks.DrawTool({
        mode: 'Rectangle',
        symbol : {
          lineColor: '#34495e',
          lineWidth: 2,
          polygonFill: 'rgb(135,196,240)',
          polygonOpacity: 0.6,
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
  getDrawLayer() {
    return this._vectorLayer;
  }
  // 结束绘制
  endDraw() {
    if (this._vectorLayer) {
      this._vectorLayer.clear();
      this._drawTool?.disable();
      this.map.resetCursor();
    }
  }
  // 获取下载范围
  getDownloadExtent() {
    if (!this._vectorLayer) return null;
    return this._vectorLayer.getExtent();
  }
  // 获取下载Geometry，多个默认取首个
  getDownloadGeometry() {
    if (!this._vectorLayer) return null;
    const geo = this._vectorLayer.getGeometries()[0];
    if (geo.getType() === 'MultiPolygon') {
      return geo.getGeometries()[0];
    } else if(geo.getType() !== 'MultiPolygon') {
      return geo;
    } else {
      return null;
    }
  }
  // 获取瓦片图层参数
  getBaseMapConfig() {
    const baseMap = this.map.getBaseLayer();
    if (baseMap instanceof maptalks.GroupTileLayer) {
      const layers = baseMap.layers;
      return {
        config: layers.map(temp => {return temp.config();}),
        projection: baseMap.getProjection(),
        tileLayer: layers,
        maxZoom: baseMap.getMaxZoom(),
        minZoom: baseMap.getMinZoom(),
      };
    } else {
      return {
        config: baseMap.config(),
        projection: baseMap.getProjection(),
        tileLayer: baseMap,
        maxZoom: baseMap.getMaxZoom(),
        minZoom: baseMap.getMinZoom(),
      };
    }
  }
  // 添加geojson至地图
  addGeometry(geojson, events = false, cb = null) {
    const geometry = maptalks.GeoJSON.toGeometry(geojson, geo => {
      const polygonStyle = {
        lineColor: '#34495e',
        lineWidth: 2,
        polygonFill: 'rgb(135,196,240)',
        polygonOpacity: 0.6,
      };
      const labelStyle = {
        'textName'  : '点击下载',
        'textFill' : '#34495e',
        'textPlacement' : 'polygon',
        'textSize'  : 16,
      };
      if (geo.getType() === 'MultiPolygon' && geo.getGeometries().length > 1) {
        geo.setSymbol({
          ...polygonStyle,
        });
        geo.getGeometries()[0].setSymbol({
          ...polygonStyle,
          ...labelStyle,
        });
      } else {
        geo.setSymbol({
          ...polygonStyle,
          ...labelStyle,
        });
      }
    });
    this._vectorLayer.addGeometry(geometry);

    if (events && geometry && geometry.length > 0) {
      geometry[0].on('click', (event) => {
        if (typeof cb === 'function') cb(event);
      });
    }

  }
  // 自动适应地图范围
  fitExtent() {
    this.map.fitExtent(this._vectorLayer.getExtent(), 0);
  }
}

// 地图加载状态
const MapLoading = ref(false);
export function setMapLoading(val) {
  MapLoading.value = val;
}
export function getMapLoading() {
  return MapLoading;
}

let _testDraw;
/**
 * 根据行列号绘制瓦片外框
 * @param {*} tileLayer
 * @param {*} tileConfig
 */
export function testDraw(tileLayer, tileConfig) {
  if (!_testDraw) {
    const map = tileLayer.getMap();
    _testDraw = new maptalks.VectorLayer('test-vector').addTo(map);
  }
  _testDraw.clear();
  const extent = calcExtentByTile(tileLayer, tileConfig);
  const polygon = new maptalks.Polygon([
    [
      [extent.xmin, extent.ymax],
      [extent.xmax, extent.ymax],
      [extent.xmax, extent.ymin],
      [extent.xmin, extent.ymin],
      [extent.xmin, extent.ymax],
    ],
  ], {
    visible : true,
    editable : false,
    cursor : 'pointer',
    shadowBlur : 0,
    shadowColor : 'black',
    draggable : false,
    dragShadow : false,
    drawOnAxis : null,
    symbol: {
      'lineColor' : '#34495e',
      'lineWidth' : 1,
      'polygonFill' : 'rgb(135,196,240)',
      'polygonOpacity' : 0.3,
      'textName'  : `X: ${tileConfig.x}, Y: ${tileConfig.y}, Z: ${tileConfig.z}`,
      'textFill' : '#34495e',
      'textPlacement' : 'polygon',
      'textSize'  : 16,
    },
  });
  _testDraw.addGeometry(polygon);
}

export function testDraw2(tileLayer, geojson) {
  if (!_testDraw) {
    const map = tileLayer.getMap();
    _testDraw = new maptalks.VectorLayer('test-vector').addTo(map);
  }
  const geometry = maptalks.GeoJSON.toGeometry(geojson, geo => {
    const polygonStyle = {
      lineColor: 'red',
      lineWidth: 2,
      polygonFill: 'red',
      polygonOpacity: 0.6,
    };
    const labelStyle = {
      'textName'  : '裁切范围',
      'textFill' : 'red',
      'textPlacement' : 'polygon',
      'textSize'  : 16,
    };
    if (geo.getType() === 'MultiPolygon' && geo.getGeometries().length > 1) {
      geo.setSymbol({
        ...polygonStyle,
      });
      geo.getGeometries()[0].setSymbol({
        ...polygonStyle,
        ...labelStyle,
      });
    } else {
      geo.setSymbol({
        ...polygonStyle,
        ...labelStyle,
      });
    }
  });
  _testDraw.addGeometry(geometry);
}

/**
 * 根据行列号计算瓦片坐标范围
 * 不支持瓦片：百度
 * @param {Object} tileConfig 瓦片参数
 * @returns 坐标范围
 */
function calcExtentByTile(tileConfig) {
  const {
    width,
    height,
    spatialReference,
    prj,
    fullExtent,
    code,
    tile,
  } = tileConfig;
  const { x, y, z } = tile;
  const resolution = spatialReference.getResolution(z);
  if (code === 'BAIDU') {
    throw new Error('暂不支持百度');
  } else {
    const xmin = resolution * x * width + fullExtent.xmin;
    const xmax = xmin + width * resolution;
    const ymin = resolution * y * height + fullExtent.ymin;
    const ymax = ymin + height * resolution;
    const leftBottom = prj.unproject({x:xmin, y:ymin});
    const rightTop = prj.unproject({x:xmax, y:ymax});
    return {
      xmin: leftBottom.x,
      xmax: rightTop.x,
      ymin: -leftBottom.y,
      ymax: -rightTop.y,
    };
  }
}


// plygon rect
/**
 * 1.polygon和rect相交 - 裁切       @turf/boolean-crosses
 * 2.polygon包含rect -   整个下载   @turf/boolean-contains
 * 3.polygon与rect相离 - 不下载     @turf/boolean-disjoint
 */

/**
 * 判断瓦片和下载范围的关系
 * @param {maptalks.Geometry} geometry 多边形
 * @param {Object} tileConfig 瓦片参数
 * @returns 1 - 包含；2 - 相离；Polygon<Object> - 相交
 */
export function judgeTile(geometry, tileConfig) {
  // 瓦片范围
  const extent = calcExtentByTile(tileConfig);
  const rect = turf.polygon([[
    [extent.xmin, extent.ymax],
    [extent.xmax, extent.ymax],
    [extent.xmax, extent.ymin],
    [extent.xmin, extent.ymin],
    [extent.xmin, extent.ymax],
  ]]);
  // 多边形下载范围
  const geoJson = geometry.toGeoJSON();
  const polygon = turf.polygon(geoJson.geometry.coordinates);
  try {
    // 空间关系判断-不相交
    // const isDisjoint = booleanDisjoint(polygon, rect);
    // if (isDisjoint) return 2;
    // 空间关系判断-包含
    const isContains = booleanContains(polygon, rect);
    if (isContains) return 1;
    // 空间关系判断-相交
    const intersection = intersect(polygon, rect);
    if (intersection) {
      return {intersection, rect};
    }
    return 2; // 空间关系判断-不相交
  } catch (e) {
    // console.error(e);
    return 1;
  }

}
