import BaseTileLayer from './BaseTileLayer';
import params from './../param';

class BaiduTileLayer extends BaseTileLayer {
    constructor(id, options = {}) {
        const style = options.style || 'Normal';
        options.urlTemplate = params().Baidu[style].url;
        super(id, options);
    }
}

export default BaiduTileLayer;
