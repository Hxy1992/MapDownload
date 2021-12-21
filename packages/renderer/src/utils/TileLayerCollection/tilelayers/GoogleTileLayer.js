import BaseTileLayer from './BaseTileLayer';
import params from './../param';

class GoogleTileLayer extends BaseTileLayer {
    constructor(id, options = {}) {
        const style = options.style || 'Normal';
        options.urlTemplate = params().Google[style].url;
        super(id, options);
    }
}

export default GoogleTileLayer;
