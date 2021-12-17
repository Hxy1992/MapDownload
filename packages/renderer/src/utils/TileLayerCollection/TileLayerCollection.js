import TdtTileLayer from './tilelayers/TdtTileLayer';
import GeoqTileLayer from './tilelayers/GeoqTileLayer';
import GoogleTileLayer from './tilelayers/GoogleTileLayer';
import AmapTileLayer from './tilelayers/AmapTileLayer';
import TencentTileLayer from './tilelayers/TencentTileLayer';
import OsmTileLayer from './tilelayers/OsmTileLayer';
import CartoDbTileLayer from './tilelayers/CartoDbTileLayer';
import MapboxTileLayer from './tilelayers/MapboxTileLayer';
import BaiduTileLayer from './tilelayers/BaiduTileLayer';
import { GroupTileLayer } from 'maptalks';
import Utils from './utils';

class TileLayerCollection {

    static getTdtTileLayer(id, options = {}) {
        const baselayers = [];
        const baseLayer = new TdtTileLayer(Utils.uuid(), options);
        baselayers.push(baseLayer);

        if (options.style) {
            options.style = options.style + '_Label';
            const baseLayer1 = new TdtTileLayer(Utils.uuid(), options);
            baselayers.push(baseLayer1);
        }

        return new GroupTileLayer(id, baselayers, {attribution: options.attribution});

    }

    static getGeoqTileLayer(id, options = {}) {
        const baseLayer = new GeoqTileLayer(id, options);
        return baseLayer;
    }

    static getGoogleTileLayer(id, options = {}) {
        const baseLayer = new GoogleTileLayer(id, options);
        return baseLayer;
    }

    static getAmapTileLayer(id, options = {}) {
        if (options.style === 'Satellite') {
            const baseLayers = [];
            const baseLayer = new AmapTileLayer(Utils.uuid(), options);
            baseLayers.push(baseLayer);
            options.style = options.style + '_Label';
            const baseLayer1 = new AmapTileLayer(Utils.uuid(), options);
            baseLayers.push(baseLayer1);
            return new GroupTileLayer(id, baseLayers, {attribution: options.attribution});
        } else {
            return new AmapTileLayer(id, options);
        }
    }

    static getTencentTileLayer(id, options = {}) {
        if (options.style === 'Normal') {
            return new TencentTileLayer(id, options);
        } else {
            const baseLayers = [];
            const baseLayer = new TencentTileLayer(Utils.uuid(), options);
            baseLayers.push(baseLayer);
            options.style = options.style + '_Label';
            const baseLayer1 = new TencentTileLayer(Utils.uuid(), options);
            baseLayers.push(baseLayer1);
            return new GroupTileLayer(id, baseLayers, {attribution: options.attribution});
        }
    }

    static getOsmTileLayer(id, options = {}) {
        return new OsmTileLayer(id, options);
    }

    static getCartoDbTileLayer(id, options = {}) {
        return new CartoDbTileLayer(id, options);
    }

    static getMapboxTileLayer(id, options = {}) {
        return new MapboxTileLayer(id, options);
    }

    static getBaiduTileLayer(id, options = {}) {
      return new BaiduTileLayer(id, options);
    }
}

export default TileLayerCollection;
