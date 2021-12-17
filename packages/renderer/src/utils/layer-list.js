// 地图列表
const BaiduConstomSubdomains = [0, 1, 2]; // 百度自定义瓦片子域名
const mapList = [
  {
    label: '高德',
    value: 'Amap',
    children: [
      {
        label: '电子地图',
        value: 'Normal',
        prejection: 'EPSG:3857',
        attribution: '高德-电子地图',
      },
      {
        label: '卫星地图',
        value: 'Satellite',
        prejection: 'EPSG:3857',
        attribution: '高德-卫星地图',
      },
    ],
  },
  {
    label: '百度',
    value: 'Baidu',
    children: [
      {
        label: '电子地图',
        value: 'Normal',
        prejection: 'baidu',
        subdomains: [0, 1, 2, 3],
        attribution: '百度-电子地图',
      },
      {
        label: '卫星地图',
        value: 'Satellite',
        prejection: 'baidu',
        subdomains: [0, 1, 2, 3],
        attribution: '百度-卫星地图',
      },
      {
        label: '午夜蓝',
        value: 'midnight',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
        attribution: '百度-自定义-午夜蓝',
      },
      {
        label: '清新蓝',
        value: 'light',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
        attribution: '百度-自定义-清新蓝',
      },
      {
        label: '黑夜',
        value: 'dark',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
        attribution: '百度-自定义-黑夜',
      },
      {
        label: '红色警戒',
        value: 'redalert',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
        attribution: '百度-自定义-红色警戒',
      },
      {
        label: '精简(仿google)',
        value: 'googlelite',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
        attribution: '百度-自定义-精简',
      },
      {
        label: '自然绿',
        value: 'grassgreen',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
        attribution: '百度-自定义-自然绿',
      },
      {
        label: '浪漫粉',
        value: 'pink',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
        attribution: '百度-自定义-浪漫粉',
      },
      {
        label: '青春绿',
        value: 'darkgreen',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
        attribution: '百度-自定义-青春绿',
      },
      {
        label: '清新蓝绿',
        value: 'bluish',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
        attribution: '百度-自定义-清新蓝绿',
      },
      {
        label: '高端灰',
        value: 'grayscale',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
        attribution: '百度-自定义-高端灰',
      },
      {
        label: '强边界',
        value: 'hardedge',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
        attribution: '百度-自定义-强边界',
      },
    ],
  },
  {
    label: '腾讯',
    value: 'Tencent',
    children: [
      {
        label: '电子地图',
        value: 'Normal',
        prejection: 'EPSG:3857',
        attribution: '腾讯-电子电梯',
      },
      {
        label: '卫星地图',
        value: 'Satellite',
        prejection: 'EPSG:3857',
        attribution: '腾讯-卫星地图',
      },
      {
        label: '地形图',
        value: 'Terrain',
        prejection: 'EPSG:3857',
        attribution: '腾讯-地形图',
      },
    ],
  },
  {
    label: 'OpenStreetMap',
    value: 'Osm',
    children: [
      {
        label: '电子地图',
        value: 'Normal',
        prejection: 'EPSG:3857',
        attribution: 'OpenStreetMap-电子地图',
      },
      {
        label: '骑行图',
        value: 'Bike',
        prejection: 'EPSG:3857',
        attribution: 'OpenStreetMap-骑行图',
      },
      {
        label: '交通图',
        value: 'Transport',
        prejection: 'EPSG:3857',
        attribution: 'OpenStreetMap-交通图',
      },
      {
        label: '山地图',
        value: 'Humanitarian',
        prejection: 'EPSG:3857',
        attribution: 'OpenStreetMap-山地图',
      },
    ],
  },
  {
    label: 'CartoDb',
    value: 'CartoDb',
    children: [
      {
        label: '地图(白)',
        value: 'Light',
        prejection: 'EPSG:3857',
        attribution: 'CartoDb-白',
      },
      {
        label: '地图(黑)',
        value: 'Dark',
        prejection: 'EPSG:3857',
        attribution: 'CartoDb-黑',
      },
    ],
  },
  {
    label: 'ArcGIS',
    value: 'Geoq',
    children: [
      {
        label: '彩色',
        value: 'Colour',
        prejection: 'EPSG:3857',
        attribution: 'ArcGIS-彩色',
      },
      {
        label: '灰度',
        value: 'Gray',
        prejection: 'EPSG:3857',
        attribution: 'ArcGIS-灰度',
      },
      {
        label: '午夜蓝',
        value: 'Midnightblue',
        prejection: 'EPSG:3857',
        attribution: 'ArcGIS-午夜蓝',
      },
    ],
  },
];
export default mapList;
export function defaultMap() {
  return { parent: mapList[0].value, layer: mapList[0].children[0] };
}
