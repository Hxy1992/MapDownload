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
            <div
              class="layer-name"
              @click="choose(item, child)"
            >
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
import LayerList from '/@/utils/layer-list.js';
import {getKeys} from '/@/utils/map-key.js';
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
      layers: LayerList,
    };
  },
  mounted() {
  },
  methods: {
    choose(item, child) {
      const {mapboxKey, tdtKey} = getKeys();
      if ((item.value === 'Mapbox' && !mapboxKey) || (item.value === 'Tdt' && !tdtKey)) {
        // eslint-disable-next-line
        this.$emit('showMapkey');
        return;
      }
      // eslint-disable-next-line
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
        width: 140px;
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
