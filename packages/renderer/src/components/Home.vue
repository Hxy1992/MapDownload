<template>
  <div id="map" />
  <div class="box-controls">
    <!-- <button
      class="my-button"
      @click="setFolder"
    >
      选择文件夹
    </button> -->
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
    <layer-control
      :visible="layersVisible"
      @choose="chooseLayers"
    />
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import TMap from '../utils/t-map.js';
import LayerControl from './LayerControl.vue';
// eslint-disable-next-line
let map
export default defineComponent({
  name: 'HomeMain',
  components: {
    LayerControl,
  },
  setup() {

  },
  data() {
    return {
      layersVisible: false,
      isDrawing: false,
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
    },
    async setFolder() {
      const list = await window.electron.ipcRenderer.invoke('show-dialog');
      console.log(list);
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
      background-image: url(/@/assets/earth.png);
    }
    &.draw{
      border: 2px solid #666666;
      border-radius: 5px;
      &.isdraw{
        border-color: aquamarine;
      }
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
