<template>
  <div
    ref="container"
    class="box-progress"
  >
    <progress
      ref="progress"
      class="progress"
      value="0"
      max="100"
    />
    <div class="item">
      已下载:<span
        ref="progressSuccess"
        class="success"
      />
    </div>
    <div class="item">
      失败:<span
        ref="progressError"
        class="error"
      />
    </div>
    <button @click="closeProgress">
      关闭
    </button>
  </div>
</template>

<script >
import {defineComponent} from 'vue';
import { setProgressDom, showProgress } from '../utils/progress';

export default defineComponent({
  name: 'ProgressControl',
  data() {
    return {
    };
  },
  mounted() {
    setProgressDom({
      success: this.$refs['progressSuccess'],
      error: this.$refs['progressError'],
      progress: this.$refs['progress'],
      container: this.$refs['container'],
    });
  },
  methods: {
    closeProgress() {
      showProgress(false);
    },
  },
});
</script>

<style lang="scss" scoped>
.box-progress{
  position: absolute;
  right: 10px;
  bottom: 10px;
  background-color: white;
  box-shadow: 0px 2px 4px 0px rgb(54 58 80 / 30%);
  width: 200px;
  padding: 8px;
  z-index: 100;
  display: none;
  .progress{
    width: 100%;
  }
  .item{
    text-align: left;
  }
}
</style>
