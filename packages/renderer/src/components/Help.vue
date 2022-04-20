<template>
  <div
    v-if="visible"
    class="box-modal"
  >
    <div class="dialog">
      <div class="header">
        <span class="title">帮助</span>
        <n-icon
          class="close"
          size="20"
          @click="ok"
        >
          <Close />
        </n-icon>
      </div>
      <div class="content">
        <div>
          <b>MapDownload</b> - 基于electron和maptalks实现高德地图、百度地图（包括百度自定义地图）、腾讯地图、OpenStreetMap、CartoDb、ArcGIS在线地图的下载。
        </div>
        <div>
          <b>地址</b> - https://github.com/Hxy1992/MapDownload
        </div>
        <div
          ref="code"
          class="code"
        />
      </div>
      <!-- <div class="footer">
        <button
          @click="ok"
        >
          确定
        </button>
      </div> -->
    </div>
  </div>
</template>

<script>
import {defineComponent} from 'vue';
import { marked } from 'marked';
import { Close } from '@vicons/ionicons5';

export default defineComponent({
  name: 'HelpDialog',
  components: {
    Close,
  },
  props: {
    visible: {
      required: true,
      type: Boolean,
    },
  },
  setup() {

  },
  data() {
    return {
    };
  },
  watch: {
    visible(val) {
      if (val) this.$nextTick(() => {
        this.updateCode();
      });
    },
  },
  mounted() {
  },
  methods: {
    updateCode() {
      const code = `
## 下载瓦片加载方式

### Cesium

\`\`\`javascript
// 非百度地图
viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
  url: 'http://localhost:7099/{z}/{x}/{y}.png'
}))
// 百度地图（需自定义BaiduImageryProvider），可参考cesium-helper目录下代码
import BaiduImageryProvider from './cesium-helper/BaiduImageryProvider/BaiduImageryProvider.js'
viewer.imageryLayers.addImageryProvider(new BaiduImageryProvider({
  url: 'http://localhost:7099/{z}/{x}/{y}.png'
}))

\`\`\`

### openlayers

\`\`\`javascript
// 非百度地图
const baseMap = new ol.layer.Tile({
  source: new ol.source.XYZ({
    url: 'http://localhost:7099/{z}/{x}/{y}.png',
    projection: 'EPSG:3857',
  }),
});
const map = new ol.Map({
  layers: [baseMap],
  target: 'map',
  view: new ol.View({
    center: ol.proj.transform([105.08052356963802, 36.04231948670001], 'EPSG:4326', 'EPSG:3857'),
    zoom: 5,
  }),
});

\`\`\`

### maptalks

\`\`\`javascript
// 非百度地图
var map = new maptalks.Map('map', {
  center: [105.08052356963802, 36.04231948670001],
  zoom: 5,
  minZoom:1,
  maxZoom:19,
  baseLayer: new maptalks.TileLayer('base', {
    'urlTemplate' : 'http://localhost:7099/{z}/{x}/{y}.png'
  })
});
//百度地图
var map = new maptalks.Map('map', {
  center: [105.08052356963802, 36.04231948670001],
  zoom: 5,
  minZoom:1,
  maxZoom:19,
  spatialReference:{
    projection : 'baidu',
  },
  baseLayer: new maptalks.TileLayer('base', {
    'urlTemplate' : 'http://localhost:7099/{z}/{x}/{y}.png'
  })
});
\`\`\`
      `;
      this.$refs.code.innerHTML = marked.parse(code);
    },
    ok() {
      // eslint-disable-next-line
      this.$emit('ok');
    },
  },
});
</script>

<style lang="scss" scoped>
.box-modal{
  position: fixed;
  left: 0px;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  .dialog{
    width: 850px;
    padding: 8px;
    background-color: white;
    box-shadow: 0px 2px 4px 0px rgb(54 58 80 / 30%);
    border-radius: 3px;
    .header{
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 8px;
      .title{
        color: #303133;
        font-weight: bold;
      }
      .close{
        cursor: pointer;
      }
    }
    .content{
      width: 100%;
      padding: 8px 16px;
      .code{
        height: 400px;
        overflow: auto;
        background: #aaa9af;
      }
    }
    .footer{
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px 8px;
      button{
        cursor: pointer;
      }
    }
  }
}

</style>
