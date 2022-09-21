import * as maptalks from 'maptalks';
const isNil = maptalks.Util.isNil;
const PointExtent = maptalks.PointExtent;
const Point = maptalks.Point;
const isSetAvailable = typeof Set !== 'undefined';
class TileHashset {
  constructor() {
      this._table = isSetAvailable ? new Set() : {};
  }

  add(key) {
      if (isSetAvailable) {
          this._table.add(key);
      } else {
          this._table[key] = true;
      }
  }

  has(key) {
      if (isSetAvailable) {
          return this._table.has(key);
      } else {
          return this._table[key];
      }
  }

  reset() {
      if (isSetAvailable) {
          this._table.clear();
      } else {
          this._table = {};
      }

  }
}
const TEMP_POINT = new Point(0, 0);
const TEMP_POINT0 = new Point(0, 0);
const TEMP_POINT1 = new Point(0, 0);
const TEMP_POINT2 = new Point(0, 0);
const TEMP_POINT3 = new Point(0, 0);

import { downloadImage } from './download';
import { progressAddSuccess, progressAddError } from './progress';

// 下载瓦片
maptalks.TileLayer.prototype.downloadCascadeTiles = async function(z, downloadOption) {
  const map = this.getMap();
  const pitch = map.getPitch();
  const parentRenderer = undefined;
  const mapExtent = map.getContainerExtent();

  const minZoom = this.getMinZoom();
  const cascadePitch0 = map.options['cascadePitches'][0];
  const cascadePitch1 = map.options['cascadePitches'][1];
  const visualHeight1 = Math.floor(map._getVisualHeight(cascadePitch1));
  const tileZoom = isNil(z) ? this._getTileZoom(map.getZoom()) : z;
  this._visitedTiles = new TileHashset();
  if (
      !isNil(z) ||
      !this.options['cascadeTiles'] ||
      pitch <= cascadePitch0 ||
      !isNil(minZoom) && tileZoom <= minZoom
  ) {
      const containerExtent = pitch <= cascadePitch1 ? mapExtent : new PointExtent(0, map.height - visualHeight1, map.width, map.height);
      await this.downloadTiles(tileZoom, containerExtent, 2, parentRenderer, downloadOption);
      return Promise.resolve(true);
  }
  const visualHeight0 = Math.floor(map._getVisualHeight(cascadePitch0));
  const extent0 = new PointExtent(0, map.height - visualHeight0, map.width, map.height);
  await this.downloadTiles(tileZoom, extent0, 0, parentRenderer, downloadOption);

  let cascadeHeight = extent0.ymin;

  const d = map.getSpatialReference().getZoomDirection();
  let cascadeLevels = d;
  if (pitch > cascadePitch1) {
      if (tileZoom - cascadeLevels <= minZoom) {
          cascadeLevels = 0;
      }
      const extent1 = new PointExtent(0, map.height - visualHeight1, map.width, cascadeHeight);
      await this.downloadTiles(tileZoom - cascadeLevels, extent1, 1, parentRenderer, downloadOption);
      cascadeHeight = extent1.ymin;
      cascadeLevels += 4 * d;
  }
  if (tileZoom - cascadeLevels >= minZoom) {
      const extent2 = new PointExtent(0, mapExtent.ymin, map.width, cascadeHeight);
      await this.downloadTiles(tileZoom - cascadeLevels, extent2, 2, parentRenderer, downloadOption);
  }
  return Promise.resolve(true);
};
maptalks.TileLayer.prototype.downloadTiles = async function(tileZoom, containerExtent, cascadeLevel, parentRenderer, downloadOption) {
  // rendWhenReady = false;
  const map = this.getMap();
  let z = tileZoom;
  let frustumMatrix = map.projViewMatrix;
  if (cascadeLevel < 2) {
      if (cascadeLevel === 0) {
          z -= 1;
      }
      frustumMatrix = cascadeLevel === 0 ? map.cascadeFrustumMatrix0 : cascadeLevel === 1 ? map.cascadeFrustumMatrix1 : map.projViewMatrix;
  }
  const zoom = z + this.options['zoomOffset'];
  const offset = this._getTileOffset(zoom),
      hasOffset = offset[0] || offset[1];
  if (zoom < 0) {
    return Promise.resolve(true);
  }
  if (!map || !this.isVisible() || !map.width || !map.height) {
    return Promise.resolve(true);
  }
  const minZoom = this.getMinZoom(),
      maxZoom = this.getMaxZoom();
  if (!isNil(minZoom) && z < minZoom ||
      !isNil(maxZoom) && z > maxZoom) {
        return Promise.resolve(true);
  }
  const tileConfig = this._getTileConfig();
  if (!tileConfig) {
    return Promise.resolve(true);
  }
  //$$$
  const tileOffsets = {
      zoom: offset,
  };
  const sr = this.getSpatialReference();
  const res = sr.getResolution(zoom);
  // const glScale = res / map.getGLRes();
  let glScale;
  if (this._hasOwnSR) {
      glScale = map.getGLScale(z);
  } else {
      glScale = res / map.getGLRes();
  }

  const repeatWorld = !this._hasOwnSR && this.options['repeatWorld'];

  const extent2d = this._convertToExtent2d(containerExtent);
  const maskExtent = this._getMask2DExtent();
  if (maskExtent) {
      const intersection = maskExtent.intersection(extent2d);
      if (!intersection) {
        return Promise.resolve(true);
      }
      containerExtent = intersection.convertTo(c => map._pointToContainerPoint(c, undefined, 0, TEMP_POINT));
  }
  //Get description of center tile including left and top offset
  const prjCenter = map._containerPointToPrj(containerExtent.getCenter(), TEMP_POINT0);
  const centerPoint = map._prjToPoint(prjCenter, zoom, TEMP_POINT1);
  let c;
  if (hasOffset) {
      c = this._project(map._pointToPrj(centerPoint._add(offset), zoom, TEMP_POINT1), TEMP_POINT1);
  } else {
      c = this._project(prjCenter, TEMP_POINT1);
  }

  const extentScale = map.getGLScale() / map.getGLScale(zoom);
  TEMP_POINT2.x = extent2d.xmin * extentScale;
  TEMP_POINT2.y = extent2d.ymax * extentScale;
  TEMP_POINT3.x = extent2d.xmax * extentScale;
  TEMP_POINT3.y = extent2d.ymin * extentScale;
  const pmin = this._project(map._pointToPrj(TEMP_POINT2._add(offset), zoom, TEMP_POINT2), TEMP_POINT2);
  const pmax = this._project(map._pointToPrj(TEMP_POINT3._add(offset), zoom, TEMP_POINT3), TEMP_POINT3);

  const centerTile = tileConfig.getTileIndex(c, res, repeatWorld);
  const ltTile = tileConfig.getTileIndex(pmin, res, repeatWorld);
  const rbTile = tileConfig.getTileIndex(pmax, res, repeatWorld);

  // Number of tiles around the center tile
  const top = Math.ceil(Math.abs(centerTile.idy - ltTile.idy)),
      left = Math.ceil(Math.abs(centerTile.idx - ltTile.idx)),
      bottom = Math.ceil(Math.abs(centerTile.idy - rbTile.idy)),
      right = Math.ceil(Math.abs(centerTile.idx - rbTile.idx));
  const allCount = (top + bottom + 1) * (left + right + 1);
  const tileSize = this.getTileSize();
  const renderer = this.getRenderer() || parentRenderer,
      scale = this._getTileConfig().tileSystem.scale;
  const extent = new PointExtent();
  const tilePoint = new Point(0, 0);
  for (let i = -top; i <= bottom; i++) {
      let j = -left;
      let leftVisitEnd = -Infinity;
      let rightVisitEnd = false;
      while (j >= leftVisitEnd && j <= right) {
          const idx = tileConfig.getNeighorTileIndex(centerTile.idx, centerTile.idy, j, i, res, repeatWorld);
          if (leftVisitEnd === -Infinity) {
              //从左往右遍历中
              j++;
          } else {
              //从右往左遍历中
              j--;
          }
          const tileId = this._getTileId(idx.idx, idx.idy, z);
          if (idx.out || this._visitedTiles && this._visitedTiles.has(tileId)) {
              continue;
          }
          //unique id of the tile
          let tileInfo = renderer && renderer.isTileCachedOrLoading(tileId);
          if (tileInfo) {
              tileInfo = tileInfo.info;
          }

          let p;
          if (tileInfo) {
              const { extent2d } = tileInfo;
              tilePoint.set(extent2d.xmin, extent2d.ymax);
              p = tilePoint;
          } else if (!this._hasOwnSR) {
              p = tileConfig.getTilePointNW(idx.x, idx.y, res);
              // const pnw = tileConfig.getTilePrjNW(idx.x, idx.y, res);
              // p = map._prjToPoint(this._unproject(pnw, TEMP_POINT3), z);
          } else {
              const pnw = tileConfig.getTilePrjNW(idx.x, idx.y, res);
              p = map._prjToPoint(this._unproject(pnw, TEMP_POINT3), z);
          }

          let width, height;
          if (!this._hasOwnSR) {
              width = tileSize.width;
              height = tileSize.height;
          } else {
              let pp;
              if (!this._hasOwnSR) {
                  pp = tileConfig.getTilePointSE(idx.x, idx.y, res);
              } else {
                  const pse = tileConfig.getTilePrjSE(idx.x, idx.y, res);
                  pp = map._prjToPoint(this._unproject(pse, TEMP_POINT3), z, TEMP_POINT3);
              }
              width = Math.ceil(Math.abs(pp.x - p.x));
              height = Math.ceil(Math.abs(pp.y - p.y));
          }
          const dx = scale.x * (idx.idx - idx.x) * width,
              dy = scale.y * (idx.idy - idx.y) * height;
          if (!tileInfo && (dx || dy)) {
              p._add(dx, dy);
          }


          const tileExtent = tileInfo && tileInfo.extent2d || new PointExtent(p.x, p.y - height, p.x + width, p.y);
          // if (hasOffset) {
          //     tileExtent.set(p.x, p.y - height, p.x + width, p.y);
          // }
          if (allCount <= 4 || rightVisitEnd || this._isTileInExtent(frustumMatrix, tileExtent, offset, glScale)) {
              if (this._visitedTiles && cascadeLevel === 0) {
                this._visitedTiles.add(tileId);
              }
              if (cascadeLevel === 0) {
                const tiles = [];
                this._splitTiles(frustumMatrix, tiles, renderer, idx, z + 1, tileExtent, dx, dy, tileOffsets, parentRenderer);
                extent._combine(tileExtent);
                const rrr = await downloadImage(tiles[0], downloadOption);
                if (rrr) {
                  progressAddSuccess();
                } else {
                  progressAddError();
                }
              } else {
                  if (!tileInfo) {
                      tileInfo = {
                          //reserve point caculated by tileConfig
                          //so add offset because we have p._sub(offset) and p._add(dx, dy) if hasOffset
                          'z': z,
                          'x': idx.x,
                          'y': idx.y,
                          'idx': idx.idx,
                          'idy': idx.idy,
                          'extent2d': tileExtent,
                          'offset': offset,
                          'id': tileId,
                          'url': this.getTileUrl(idx.x, idx.y, z),
                      };
                      if (parentRenderer) {
                          tileInfo['layer'] = this.getId();
                      }
                  } else {
                      tileInfo.offset[0] = offset[0];
                      tileInfo.offset[1] = offset[1];
                  }

                  const rrr = await downloadImage(tileInfo, downloadOption);
                  if (rrr) {
                    progressAddSuccess();
                  } else {
                    progressAddError();
                  }
                  extent._combine(tileExtent);
              }
              if (leftVisitEnd === -Infinity) {
                  //从左往右第一次遇到可视的瓦片，改为从右往左遍历
                  leftVisitEnd = j;
                  j = right;// - Math.max(j - -left - 4, 0);
                  // rightVisitEnd = true;
              } else if (!rightVisitEnd) {
                  //从右往左第一次遇到可视瓦片，之后的瓦片全部可视
                  rightVisitEnd = true;
              }
          }
      }
  }
  return Promise.resolve(true);
};
