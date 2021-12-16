<template>
  <div id="map" />
  <div class="box-controls">
    <div
      class="items layers"
      title="切换地图源"
      @click="showLayers"
    />
    <div class="splitline" />
    <div
      :class="{items: true, draw: true, isdraw: isDrawing}"
      title="绘制矩形"
      @click="drawRect"
    />
    <div class="splitline" />
    <div
      class="items download"
      title="下载地图"
      @click="showSave"
    />
    <layer-control
      :visible="layersVisible"
      @choose="chooseLayers"
    />
    <save-diablog
      :visible="saveVisible"
      :download-extent="downloadExtent"
      @ok="save"
      @cancel="cancelSave"
    />
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import TMap from '../utils/t-map.js';
import LayerControl from './LayerControl.vue';
import SaveDiablog from './Save.vue';
import FileSave from '../utils/file-save.js';
// eslint-disable-next-line
let map
export default defineComponent({
  name: 'HomeMain',
  components: {
    LayerControl,
    SaveDiablog,
  },
  setup() {

  },
  data() {
    return {
      layersVisible: false,
      isDrawing: false,
      saveVisible: false,
      downloadExtent: {},
    };
  },
  mounted() {
    map = new TMap('map');
  },
  methods: {
    showLayers() {
      this.layersVisible = true;
    },
    chooseLayers(data) {
      this.layersVisible = false;
      map.switchBaseLayer(data);
    },
    drawRect() {
      this.isDrawing = !this.isDrawing;
      if (this.isDrawing) {
        map.startDraw();
      } else {
        map.endDraw();
      }
    },
    showSave() {
      this.downloadExtent = map.getDownloadExtent();
      if (!this.downloadExtent) {
        alert('获取下载范围错误');
        return;
      }
      this.saveVisible = true;
    },
    save(val) {
      this.saveVisible = false;
      const mapConfig = map.getBaseMapConfig();
      val.mapConfig = mapConfig;
      new FileSave(val);
    },
    cancelSave() {
      this.saveVisible = false;
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
#map{
  position: absolute;
  margin: 0;
  padding: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.box-controls{
  position: absolute;
  left: 10px;
  top: 10px;
  background-color: white;
  box-shadow: 0px 2px 4px 0px rgb(54 58 80 / 30%);
  width: 200px;
  padding: 8px;
  display: flex;
  .items{
    width: 20px;
    height: 20px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    cursor: pointer;
    &.layers{
      background-image: url(/@/assets/layers.png);
    }
    &.draw{
      background-image: url(/@/assets/rect.png);
      &.isdraw{
        background-image: url(/@/assets/rect2.png);
      }
    }
    &.download{
      background-image: url(/@/assets/download.png);
    }
  }
  .splitline{
    width: 1px;
    height: 20px;
    margin: 0 8px;
    background-color: #999999;
  }
}

</style>
