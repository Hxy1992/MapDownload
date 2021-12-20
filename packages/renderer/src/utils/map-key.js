// 地图Key

const TDTKEY = 'map-key-tdt';
const MAPBOXKEY = 'map-key-mapbox';

// const MapKey = {
//   _tdtKey: '',
//   get tdtKey() {
//     return this._tdtKey;
//   },
//   set tdtKey(val) {
//     this._tdtKey = val;
//   },
//   _mapboxKey: '',
//   get mapboxKey() {
//     return this._mapboxKey;
//   },
//   set mapboxKey(val) {
//     this._mapboxKey = val;
//   },
// };

/**
 * 获取地图key
 * @returns 地图key
 */
export function getKeys() {
  return {
    tdtKey: localStorage.getItem(TDTKEY),
    mapboxKey: localStorage.getItem(MAPBOXKEY),
  };
  // return MapKey;
}
/**
 * 设置key
 * @param {*} param key对象
 */
export function setKeys(param) {
  localStorage.setItem(TDTKEY, param?.tdtKey);
  localStorage.setItem(MAPBOXKEY, param?.mapboxKey);
  // MapKey.tdtKey = param?.tdtKey;
  // MapKey.mapboxKey = param?.mapboxKey;
}
