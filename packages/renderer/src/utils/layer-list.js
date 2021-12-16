// 地图列表
const BaiduConstomSubdomains = [0, 1, 2]; // 百度自定义瓦片子域名
export default [
  {
    label: '高德',
    value: 'Amap',
    children: [
      {
        label: '电子地图',
        value: 'Normal',
        prejection: 'EPSG:3857',
      },
      {
        label: '卫星地图',
        value: 'Satellite',
        prejection: 'EPSG:3857',
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
      },
      {
        label: '卫星地图',
        value: 'Satellite',
        prejection: 'baidu',
        subdomains: [0, 1, 2, 3],
      },
      {
        label: '午夜蓝',
        value: 'midnight',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
      },
      {
        label: '清新蓝',
        value: 'light',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
      },
      {
        label: '黑夜',
        value: 'dark',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
      },
      {
        label: '红色警戒',
        value: 'redalert',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
      },
      {
        label: '精简(仿google)',
        value: 'googlelite',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
      },
      {
        label: '自然绿',
        value: 'grassgreen',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
      },
      {
        label: '浪漫粉',
        value: 'pink',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
      },
      {
        label: '青春绿',
        value: 'darkgreen',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
      },
      {
        label: '清新蓝绿',
        value: 'bluish',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
      },
      {
        label: '高端灰',
        value: 'grayscale',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
      },
      {
        label: '强边界',
        value: 'hardedge',
        prejection: 'baidu',
        subdomains: BaiduConstomSubdomains,
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
      },
      {
        label: '卫星地图',
        value: 'Satellite',
        prejection: 'EPSG:3857',
      },
      {
        label: '地形图',
        value: 'Terrain',
        prejection: 'EPSG:3857',
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
      },
      {
        label: '骑行图',
        value: 'Bike',
        prejection: 'EPSG:3857',
      },
      {
        label: '交通图',
        value: 'Transport',
        prejection: 'EPSG:3857',
      },
      {
        label: '山地图',
        value: 'Humanitarian',
        prejection: 'EPSG:3857',
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
      },
      {
        label: '地图(黑)',
        value: 'Dark',
        prejection: 'EPSG:3857',
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
      },
      {
        label: '灰度',
        value: 'Gray',
        prejection: 'EPSG:3857',
      },
      {
        label: '午夜蓝',
        value: 'Midnightblue',
        prejection: 'EPSG:3857',
      },
    ],
  },
];
