<template>
  <div
    v-if="visible"
    class="box-modal"
  >
    <div class="dialog">
      <div class="header">
        <span class="title">下载参数配置</span>
        <span
          class="close"
          @click="cancel"
        >X</span>
      </div>
      <div class="content">
        <div class="item">
          <span class="label">下载范围：</span>
          <span class="value">xmin：{{ downloadExtent.xmin }}</span>
        </div>
        <div class="item">
          <span class="label" />
          <span class="value">xmax：{{ downloadExtent.xmax }}</span>
        </div>
        <div class="item">
          <span class="label" />
          <span class="value">ymin：{{ downloadExtent.ymin }}</span>
        </div>
        <div class="item">
          <span class="label" />
          <span class="value">ymax：{{ downloadExtent.ymax }}</span>
        </div>
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
          <span class="label">合并Label注释：</span>
          <div class="value">
            <input
              v-model="mergeLayers"
              disabled
              type="checkbox"
            >是否合并
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
      <div class="footer">
        <button @click="cancel">
          取消
        </button>
        <button
          class="ok"
          @click="ok"
        >
          确定
        </button>
      </div>
    </div>
  </div>
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
  },
  setup() {

  },
  data() {
    return {
      savePath: '',
      maxZoom: '8',
      minZoom: '5',
      mergeLayers: false,
    };
  },
  computed: {
    showMerge() {
      return Array.isArray(this.baseLayer) && this.baseLayer.length > 1;
    },
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
        return alert('请选择保存目录');
      }
      if (!this.maxZoom) {
        return alert('请输入最大层级');
      }
      if (!this.minZoom) {
        return alert('请输入最小层级');
      }
      const minZoom = parseInt(Number(this.minZoom));
      const maxZoom = parseInt(Number(this.maxZoom));
      if (isNaN(minZoom) || isNaN(maxZoom)) {
        return alert('层级格式错误，请输入非负整数');
      }
      if (minZoom >= maxZoom || minZoom < 0 || maxZoom > 18) {
        return alert('层级格式错误');
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
    width: 450px;
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
        &:hover{
          color: aqua;
        }
      }
    }
    .content{
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
    .footer{
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px 8px;
      .ok{
        margin-left: 8px;
      }
      button{
        cursor: pointer;
      }
    }
  }
}

</style>
