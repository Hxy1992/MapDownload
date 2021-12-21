import BaseTileLayer from './BaseTileLayer';
import params from './../param';

class MapboxTileLayer extends BaseTileLayer {
    constructor(id, options = {}) {
        const style = options.style || 'light';
        options.urlTemplate = params().Mapbox[style].url;
        super(id, options);
    }
}

export default MapboxTileLayer;
