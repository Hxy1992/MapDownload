// 裁切瓦片
import * as maptalks from 'maptalks';

export class ClipImage {
  constructor() {
    this.tileSize = {
      width: 256,
      height: 256,
    };
    this.createMap();
  }
  setSize(width, height) {
    if (this.tileSize.width === width && this.tileSize.height === height) return;
    this.tileSize.width = width;
    this.tileSize.height = height;
    this.dom.style.width = width + 'px';
    this.dom.style.height = height + 'px';
  }
  createMap() {
    if (this.map) return;
    const dom = document.createElement('div');
    dom.id = 'map-clip-image';
    dom.style = `
    position: fixed;
    margin: 0;
    padding: 0;
    top: 0;
    left: 0;
    width: ${this.tileSize.width}px;
    height: ${this.tileSize.height}px;
    z-index: -1;
    `;
    document.body.append(dom);
    this.dom = dom;
    const map = new maptalks.Map(dom, {
      center: [105.08052356963802, 36.04231948670001],
      zoom: 5,
      zoomAnimation: false,
      zoomAnimationDuration: 1,
      panAnimation: false,
      panAnimationDuration: 1,
      rotateAnimation: false,
      rotateAnimationDuration: 1,
    });
    this.map = map;
    this.vectorLayer = new maptalks.VectorLayer('vector', {
      drawImmediate: true,
      geometryEvents: false,
      hitDetect: false,
      forceRenderOnMoving: true,
      forceRenderOnZooming: true,
      forceRenderOnRotating: true,
    }).addTo(map);
  }
  addTempGeometry(intersection, rect) {
    this.vectorLayer.clear();
    // const polygon = new maptalks.Polygon(intersection.geometry.coordinates, {
    //   symbol: {
    //     'lineWidth' : 0,
    //     'polygonFill' : 'rgb(0,0,0)',
    //   },
    // });
    const polygon = maptalks.GeoJSON.toGeometry(intersection);
    this.vectorLayer.addGeometry(polygon);
    const extent = new maptalks.Polygon(rect.geometry.coordinates, {
      symbol: {
        'lineWidth' : 0,
        'polygonFill' : 'rgba(0,0,0,0)',
      },
    });
    this.vectorLayer.addGeometry(extent);

    const zoom = this.map.getFitZoom(extent.getExtent());
    const center = extent.getCenter();
    this.map.setCenterAndZoom(center, zoom);
  }
  getImage(imageType) {
    return new Promise(resolve => {
      // setTimeout(() => {
      //   const img = this.map.toDataURL({
      //     'mimeType' : 'image/' + imageType,
      //     'save' : false,
      //   });
      //   resolve(img);
      // }, 100);

      const isComplete = () => {
        const over = !this.map.isMoving() && !this.map.isZooming() && !this.map.isAnimating();
        if (!over) {
          requestAnimationFrame(isComplete);
        } else {
          const img = this.map.toDataURL({
            'mimeType' : 'image/' + imageType,
            'save' : false,
          });
          resolve(img);
        }
      };
      requestAnimationFrame(isComplete);
    });
  }
}
