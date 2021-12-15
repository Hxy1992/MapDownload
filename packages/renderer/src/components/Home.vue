<template>
  <div id="map" />
  <div class="box-controls">
    <button
      class="my-button"
      @click="setFolder"
    >
      选择文件夹
    </button>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import TMap from '../utils/t-map.js';

export default defineComponent({
  name: 'HomeMain',
  setup() {

  },
  mounted() {
    this.map = new TMap('map');
  },
  methods: {
    async setFolder() {
      const list = await window.electron.ipcRenderer.invoke('show-dialog');
      console.log(list);
    },
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
}
</style>
