import BaseTileLayer from './BaseTileLayer';
import params from './../param';

class OsmTileLayer extends BaseTileLayer {
    constructor(id, options = {}) {
        const style = options.style || 'Normal';
        options.urlTemplate = params().Osm[style].url;
        super(id, options);
    }
}

export default OsmTileLayer;
