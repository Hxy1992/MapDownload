# map-download

> 基于electron和maptalks实现高德、百度地图下载

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

viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
  url: 'http://localhost:7099/{z}/{x}/{y}.png'
}))

```

### maptalks

```javascript

var map = new maptalks.Map('map', {
  center: [105.08052356963802, 36.04231948670001],
  zoom: 5,
  minZoom:1,
  maxZoom:19,
  baseLayer: new maptalks.TileLayer('base', {
    'urlTemplate' : 'http://localhost:7099/{z}/{x}/{y}.png'
  })
});

```

# TODO

+ 只有高德可以正常下载，其他的瓦片规则不对
