[![Required Node.JS >= v16.13](https://img.shields.io/static/v1?label=node&message=%3E=16.13&logo=node.js&color)](https://nodejs.org/about/releases/)
[![Required npm >= v8.1](https://img.shields.io/static/v1?label=npm&message=%3E=8.1&logo=npm&color)](https://github.com/npm/cli/releases)
# map-download

> 基于electron和maptalks实现高德地图、百度地图（包括百度自定义地图 ！！！百度个性化地图午夜蓝、清新蓝、黑夜等等链接已经失效！！！）、腾讯地图、OpenStreetMap、CartoDb、ArcGIS在线地图、天地图、MapBox的下载

> 支持卫星遥感影像和标注合并

> 支持行政区划瓦片下载，裁切边界

> 支持下载瓦片格式jpeg、png、webp

> 软件下载地址：https://github.com/Hxy1992/MapDownload/releases

> V0.42版本win-unpacked压缩包 百度网盘链接：https://pan.baidu.com/s/1M12KnC8bIvyHo3ik3hxy9A   提取码：9986

![image](https://user-images.githubusercontent.com/14800641/154039927-e8994f36-523b-40cb-b184-46a7d8e1a9f2.png)


## Build Setup

``` bash
# 安装依赖(依赖较大，使用国内镜像)
npm install

# 热更新服务
npm run dev / npm run watch

# 构建web
npm run build

# 构建应用
npm run compile

```
---

## 下载瓦片加载方式

### Cesium

```javascript
// 非百度地图
viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
  url: 'http://localhost:7099/{z}/{x}/{y}.png'
}))
// 百度地图（需自定义BaiduImageryProvider），可参考cesium-helper目录下代码
import BaiduImageryProvider from './cesium-helper/BaiduImageryProvider/BaiduImageryProvider.js'
viewer.imageryLayers.addImageryProvider(new BaiduImageryProvider({
  url: 'http://localhost:7099/{z}/{x}/{y}.png'
}))

```

### openlayers

```javascript
// 非百度地图
const baseMap = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'http://localhost:7099/{z}/{x}/{y}.png',
    projection: 'EPSG:3857',
  }),
});
const map = new ol.Map({
  layers: [baseMap],
  target: 'map',
  view: new ol.View({
    center: ol.proj.transform([105.08052356963802, 36.04231948670001], 'EPSG:4326', 'EPSG:3857'),
    zoom: 5,
  }),
});

```

### maptalks

```javascript
// 非百度地图
var map = new maptalks.Map('map', {
  center: [105.08052356963802, 36.04231948670001],
  zoom: 5,
  minZoom:1,
  maxZoom:19,
  baseLayer: new maptalks.TileLayer('base', {
    'urlTemplate' : 'http://localhost:7099/{z}/{x}/{y}.png'
  })
});
//百度地图
var map = new maptalks.Map('map', {
  center: [105.08052356963802, 36.04231948670001],
  zoom: 5,
  minZoom:1,
  maxZoom:19,
  spatialReference:{
    projection : 'baidu',
  },
  baseLayer: new maptalks.TileLayer('base', {
    'urlTemplate' : 'http://localhost:7099/{z}/{x}/{y}.png'
  })
});
```

# TODO
+ 自定义图层加载、下载，支持上传geojson作为下载范围
+ 瓦片拼接大图

如果该项目对你有帮助，麻烦给个star！

声明：本软件仅供个人学习与科研使用，所下载的数据版权归各个地图服务商所有，任何组织或个人因数据使用不当造成的问题，软件作者不负责任。
