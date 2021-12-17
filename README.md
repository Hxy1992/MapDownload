# map-download

> 基于electron和maptalks实现高德地图、百度地图（包括百度自定义地图）、腾讯地图、OpenStreetMap、CartoDb、ArcGIS在线地图的下载

## Build Setup

``` bash
# 安装依赖
npm install

# 热更新服务
npm run watch

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
+ 加入天地图和mapbox，自行输入地图key
+ 优化交互和样式
