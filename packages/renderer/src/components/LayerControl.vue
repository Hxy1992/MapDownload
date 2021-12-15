<template>
  <div
    v-if="visible"
    class="box-layers"
  >
    <div
      v-for="item in layers"
      :key="item.value"
      class="group-row"
    >
      <div class="group-name">
        <span class="name">{{ item.label }}</span>
        <div class="group-children">
          <div
            v-for="child in item.children"
            :key="child.value"
          >
            <div class="layer-name" @click="choose(item, child)">
              {{ child.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from 'vue';

export default defineComponent({
  name: 'LayerControl',
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
      layers: [
        {
          label: '高德',
          value: 'Amap',
          children: [
            {
              label: '电子地图',
              value: 'Normal',
              prejection: 'EPSG:3857',
            },
            {
              label: '卫星地图',
              value: 'Satellite',
              prejection: 'EPSG:3857',
            },
          ],
        },
        {
          label: '百度',
          value: 'Baidu',
          children: [
            {
              label: '电子地图',
              value: 'Normal',
              prejection: 'baidu',
              subdomains: [0, 1, 2, 3],
            },
            {
              label: '卫星地图',
              value: 'Satellite',
              prejection: 'baidu',
              subdomains: [0, 1, 2, 3],
            },
            {
              label: '午夜蓝',
              value: 'midnight',
              prejection: 'baidu',
              subdomains: [0, 1, 2, 3],
            },
            {
              label: '清新蓝',
              value: 'light',
              prejection: 'baidu',
              subdomains: [0, 1, 2, 3],
            },
            {
              label: '黑夜',
              value: 'dark',
              prejection: 'baidu',
              subdomains: [0, 1, 2, 3],
            },
            {
              label: '红色警戒',
              value: 'redalert',
              prejection: 'baidu',
              subdomains: [0, 1, 2, 3],
            },
            {
              label: '精简（仿google）',
              value: 'googlelite',
              prejection: 'baidu',
              subdomains: [0, 1, 2, 3],
            },
            {
              label: '自然绿',
              value: 'grassgreen',
              prejection: 'baidu',
              subdomains: [0, 1, 2, 3],
            },
            {
              label: '浪漫粉',
              value: 'pink',
              prejection: 'baidu',
              subdomains: [0, 1, 2, 3],
            },
            {
              label: '青春绿',
              value: 'darkgreen',
              prejection: 'baidu',
              subdomains: [0, 1, 2, 3],
            },
            {
              label: '清新蓝绿',
              value: 'bluish',
              prejection: 'baidu',
              subdomains: [0, 1, 2, 3],
            },
            {
              label: '高端灰',
              value: 'grayscale',
              prejection: 'baidu',
              subdomains: [0, 1, 2, 3],
            },
            {
              label: '强边界',
              value: 'hardedge',
              prejection: 'baidu',
              subdomains: [0, 1, 2, 3],
            },
          ],
        },
        {
          label: '腾讯',
          value: 'Tencent',
          children: [
            {
              label: '电子地图',
              value: 'Normal',
              prejection: 'EPSG:3857',
            },
            {
              label: '卫星地图',
              value: 'Satellite',
              prejection: 'EPSG:3857',
            },
            {
              label: '地形图',
              value: 'Terrain',
              prejection: 'EPSG:3857',
            },
          ],
        },
        {
          label: 'OpenStreetMap',
          value: 'Osm',
          children: [
            {
              label: '电子地图',
              value: 'Normal',
              prejection: 'EPSG:3857',
            },
            {
              label: '骑行图',
              value: 'Bike',
              prejection: 'EPSG:3857',
            },
            {
              label: '交通图',
              value: 'Transport',
              prejection: 'EPSG:3857',
            },
            {
              label: '山地图',
              value: 'Humanitarian',
              prejection: 'EPSG:3857',
            },
          ],
        },
        {
          label: 'CartoDb',
          value: 'CartoDb',
          children: [
            {
              label: '地图（白）',
              value: 'Light',
              prejection: 'EPSG:3857',
            },
            {
              label: '地图（黑）',
              value: 'Dark',
              prejection: 'EPSG:3857',
            },
          ],
        },
        {
          label: 'ArcGIS',
          value: 'Geoq',
          children: [
            {
              label: '彩色',
              value: 'Colour',
              prejection: 'EPSG:3857',
            },
            {
              label: '灰度',
              value: 'Gray',
              prejection: 'EPSG:3857',
            },
            {
              label: '午夜蓝',
              value: 'Midnightblue',
              prejection: 'EPSG:3857',
            },
          ],
        },
      ],
    };
  },
  mounted() {
  },
  methods: {
    choose(item, child) {
      this.$emit('choose', { parent: item.value, layer: child });
    },
  },
});
</script>

<style lang="scss" scoped>
.box-layers{
  position: absolute;
  left: 0px;
  top: 36px;
  background-color: white;
  box-shadow: 0px 2px 4px 0px rgb(54 58 80 / 30%);
  .group-row{
    width: 120px;
    .group-name{
      cursor: default;
      .name{
        padding: 3px 5px;
        display: inline-block;
        &:hover{
          color: aqua;
        }
      }
      .group-children{
        display: none;
        position: absolute;
        left: 100%;
        margin-top: -20px;
        width: 120px;
        background-color: white;
        .layer-name{
          cursor: pointer;
          &:hover{
            color: aqua;
          }
        }
      }
      &:hover .group-children{
        display: block;
      }
    }
  }
}

</style>
