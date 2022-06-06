<template>
  <n-dropdown
    :options="layers"
    placement="bottom-start"
    trigger="click"
    :key-field="'uuid'"
    :on-clickoutside="onClickoutside"
    @select="handleSelect"
  >
    <n-icon
      class="sourceLayer"
      size="20"
      title="切换地图源"
      style="cursor: pointer;"
      :color="layerColor"
      @click="handleIconClick"
    >
      <Layers />
    </n-icon>
  </n-dropdown>
</template>

<script>
import {defineComponent, ref} from 'vue';
import {getMapList} from '/@/utils/layerList.js';
import {getKeys} from '/@/utils/mapKey.js';
import { Layers } from '@vicons/ionicons5';
export default defineComponent({
  name: 'LayerControl',
  components: {
    Layers,
  },
  props: {
  },
  emits: ['choose'],
  setup(prop, {emit}) {
    const showDropdownRef = ref(false);
    const layerList = getMapList();
    return {
      layers: layerList,
      layersVisible: showDropdownRef,
      icon: {
        normal: '#333333',
        active: '#2080f0',
      },
      handleSelect (key, layer) {
        const parent = layerList.find(item => { return item.uuid === layer.pid; });

        const {mapboxKey, tdtKey} = getKeys();
        if ((parent.value === 'Mapbox' && !mapboxKey) || (parent.value === 'Tdt' && !tdtKey)) {
          window.$message.warning(`请设置${parent.label}地图Key`);
        }
        emit('choose', { parent: parent.value, layer: layer });

        showDropdownRef.value = false;
      },
      handleIconClick (e) {
        e.preventDefault();
        showDropdownRef.value = true;
      },
      onClickoutside () {
        showDropdownRef.value = false;
      },
    };
  },
  data() {
    return {
    };
  },
  computed: {
    layerColor() {
      return this.layersVisible ? this.icon.active : this.icon.normal;
    },
  },
  mounted() {
  },
  methods: {
  },
});
</script>

