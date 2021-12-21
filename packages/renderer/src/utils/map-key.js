// 地图Key

const TDTKEY = 'map-key-tdt';
const MAPBOXKEY = 'map-key-mapbox';

/**
 * 获取地图key
 * @returns 地图key
 */
export function getKeys() {
  return {
    tdtKey: localStorage.getItem(TDTKEY),
    mapboxKey: localStorage.getItem(MAPBOXKEY),
  };
}
/**
 * 设置key
 * @param {*} param key对象
 */
export function setKeys(param) {
  localStorage.setItem(TDTKEY, param?.tdtKey);
  localStorage.setItem(MAPBOXKEY, param?.mapboxKey);
}
