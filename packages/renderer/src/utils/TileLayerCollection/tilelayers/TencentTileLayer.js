import BaseTileLayer from './BaseTileLayer';
import params from './../param';

class TencentTileLayer extends BaseTileLayer {
    constructor(id, options = {}) {
        const style = options.style || 'Normal';
        options.urlTemplate = params().Tencent[style].url;
        super(id, options);
    }

    getTileUrl(x, y, z) {
        const urlArgs = this.getUrlArgs(x, y, z);
        const l = urlArgs.z;
        const r = urlArgs.x;
        const c = urlArgs.y;

        const m = Math.floor(r / 16.0);
        const n = Math.floor(c / 16.0);
        const urlTemplate = this.options['urlTemplate'];
        const url = urlTemplate.replace('{x}', r).replace('{y}', c).replace('{z}', l).replace('{m}', m).replace('{n}', n);
        return url;

    }

    getUrlArgs(x, y, z) {
        return {
            z: z,
            x: x,
            y: Math.pow(2, z) - 1 - y
        };
    }
}

export default TencentTileLayer;
