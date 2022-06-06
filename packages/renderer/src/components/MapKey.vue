<template>
  <n-modal
    :show="showModal"
    :show-icon="false"
    :on-mask-click="cancel"
    :on-esc="cancel"
    :on-close="cancel"
    preset="dialog"
  >
    <template #header>
      地图Key配置
    </template>
    <div class="dialog-content">
      <div class="item">
        <span class="label">天地图：</span>
        <input
          v-model="tdtKey"
          class="value"
          type="text"
        >
      </div>
      <div class="item">
        <span class="label">MapBox：</span>
        <input
          v-model="mapboxKey"
          class="value"
          type="text"
        >
      </div>
    </div>
    <template #action>
      <n-button @click="cancel">
        取消
      </n-button>
      <n-button
        type="info"
        @click="ok"
      >
        确定
      </n-button>
    </template>
  </n-modal>
</template>

<script>
import {defineComponent} from 'vue';
import {getKeys, setKeys} from '/@/utils/mapKey.js';
export default defineComponent({
  name: 'MapKey',
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
      showModal: false,
      tdtKey: '',
      mapboxKey: '',
    };
  },
  watch: {
    visible() {
      this.showModal = this.visible;
    },
  },
  created() {
    this.showModal = this.visible;
  },
  mounted() {
    this.getKeys();
  },
  methods: {
    getKeys() {
      const data = getKeys();
      this.tdtKey = data?.tdtKey;
      this.mapboxKey = data?.mapboxKey;
    },
    cancel() {
      // eslint-disable-next-line
      this.$emit('hide');
    },
    ok() {
      setKeys({
        tdtKey: this.tdtKey || '',
        mapboxKey: this.mapboxKey || '',
      });
      this.cancel();
    },
  },
});
</script>

<style lang="scss" scoped>
.dialog-content{
  width: 100%;
  padding: 8px 16px;
  .item{
    margin: 3px 0;
  }
  .label{
    display: inline-block;
    width: 80px;
    text-align: right;
  }
  .value{
    display: inline-block;
    width: 260px;
  }
}

</style>
