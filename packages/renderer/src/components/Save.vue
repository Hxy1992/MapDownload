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
      下载参数配置
    </template>
    <div class="dialog-content">
      <n-descriptions
        label-placement="left"
        title="下载范围"
        size="small"
        :column="1"
        class="descriptions"
      >
        <n-descriptions-item label="xmin">
          {{ downloadExtent.xmin }}
        </n-descriptions-item>
        <n-descriptions-item label="xmax">
          {{ downloadExtent.xmax }}
        </n-descriptions-item>
        <n-descriptions-item label="ymin">
          {{ downloadExtent.ymin }}
        </n-descriptions-item>
        <n-descriptions-item label="ymax">
          {{ downloadExtent.ymax }}
        </n-descriptions-item>
      </n-descriptions>
      <div class="item">
        <span class="label">最大层级：</span>
        <input
          v-model="maxZoom"
          class="value"
          type="text"
        >
      </div>
      <div class="item">
        <span class="label">最小层级：</span>
        <input
          v-model="minZoom"
          class="value"
          type="text"
        >
      </div>
      <div
        v-if="showMerge"
        class="item"
      >
        <span class="label">标注下载：</span>
        <div class="value">
          <input
            v-model="mergeLayers"
            type="checkbox"
          >是否合并
        </div>
      </div>
      <div class="item">
        <span class="label">边界裁切：</span>
        <div class="value">
          <input
            v-model="clipImage"
            type="checkbox"
            disabled
          >
        </div>
      </div>
      <div class="item">
        <span class="label">下载路径：</span>
        <div class="value">
          <input
            v-model="savePath"
            type="text"
            disabled
            style="width:215px;"
          >
          <button @click="setFolder">
            选择
          </button>
        </div>
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
export default defineComponent({
  name: 'SaveDialog',
  props: {
    visible: {
      required: true,
      type: Boolean,
    },
    downloadExtent: {
      required: true,
      type: Object,
    },
    baseLayer: {
      required: true,
      type: [Object, Array],
    },
    limitMinZoom: {
      required: true,
      type: Number,
    },
    limitMaxZoom: {
      required: true,
      type: Number,
    },
  },
  setup() {

  },
  data() {
    return {
      showModal: false,
      savePath: '',
      maxZoom: '8',
      minZoom: '5',
      mergeLayers: false,
      clipImage: false,
    };
  },
  computed: {
    showMerge() {
      return Array.isArray(this.baseLayer) && this.baseLayer.length > 1;
    },
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
  },
  methods: {
    reset() {
      this.savePath = '';
      this.maxZoom = '';
      this.minZoom = '';
    },
    async setFolder() {
      const result = await window.electron.ipcRenderer.invoke('show-dialog');
      if (result.canceled) return;
      this.savePath = result.filePaths[0];
    },
    cancel() {
      this.reset();
      // eslint-disable-next-line
      this.$emit('cancel', {});
    },
    ok() {
      if (!this.savePath) {
        return window.$message.warning('请选择保存目录');
      }
      if (!this.maxZoom) {
        return window.$message.warning('请输入最大层级');
      }
      if (!this.minZoom) {
        return window.$message.warning('请输入最小层级');
      }
      const minZoom = parseInt(Number(this.minZoom));
      const maxZoom = parseInt(Number(this.maxZoom));
      if (isNaN(minZoom) || isNaN(maxZoom)) {
        return window.$message.warning('层级格式错误，请输入非负整数');
      }
      if (minZoom >= maxZoom || minZoom < this.limitMinZoom || maxZoom > this.limitMaxZoom) {
        return window.$message.warning('层级格式错误');
      }
      const param = {
        savePath: this.savePath,
        minZoom: minZoom,
        maxZoom: maxZoom,
        mergeLayers: this.mergeLayers,
        extent: this.downloadExtent,
      };
      // eslint-disable-next-line
      this.$emit('ok', param);
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
.descriptions{
  ::v-deep .n-descriptions-header{
    font-size: 14px;
    margin-bottom: 3px;
  }
  ::v-deep .n-descriptions-table-content__label{
    display: inline-block;
    width: 80px;
    text-align: right;
  }
}
</style>
