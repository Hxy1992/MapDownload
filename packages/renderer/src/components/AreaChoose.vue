<template>
  <n-popover
    ref="popover"
    trigger="click"
    width="200"
  >
    <template #trigger>
      <span
        style="cursor: pointer;color: #2080f0;"
        title="选择下载区域"
        @click="handleIconClick"
      >
        {{ chooseArea || '选择下载区域' }}
      </span>
    </template>
    <n-tree
      block-line
      :data="layers"
      :key-field="'areaCode'"
      :label-field="'areaName'"
      :default-expanded-keys="[-1]"
      :on-update:selected-keys="handleSelect"
      selectable
      virtual-scroll
      style="height: 320px"
    />
  </n-popover>
</template>

<script>
import {defineComponent, ref} from 'vue';
import {getAreaList} from '/@/utils/areaList.js';
export default defineComponent({
  name: 'AreaChoose',
  components: {
  },
  props: {
  },
  emits: ['choose'],
  setup(prop, {emit}) {
    const layerList = getAreaList();
    const chooseArea = ref('');
    const popover = ref();
    return {
      chooseArea: chooseArea,
      popover: popover,
      layers: layerList,
      icon: {
        normal: '#333333',
        active: '#2080f0',
      },
      handleSelect (keys, options) {
        const option = options[0];
        chooseArea.value = option.areaName;
        popover.value.setShow(false);
        option.fetchLoad().then(geojson => {
          emit('choose', {option, geojson});
        });
      },
    };
  },
  data() {
    return {
    };
  },
  computed: {
  },
  mounted() {
  },
  methods: {
  },
});
</script>

