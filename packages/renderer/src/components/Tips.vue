<template>
  <div
    v-if="visible"
    class="modal"
    @click="visible = false"
  >
    <div class="box-tips">
      <div class="title">
        地图下载教程
      </div>
      <div class="item">
        1.选择需要下载的图层（天地图和Mapbox需输入Key，可在设置中自行配置）
      </div>
      <div class="item">
        2.绘制需要下载的地图范围 or 选择下载区域
      </div>
      <div class="item">
        3.点击下载按钮，配置相关信息，点击确定
      </div>
      <div class="item">
        4.等待下载完成即可
      </div>
      <div class="opt">
        <button>确定</button>
      </div>
    </div>
  </div>
</template>

<script >
import {defineComponent} from 'vue';
export default defineComponent({
  name: 'TipsInfo',
  setup() {
  },
  data() {
    return {
      visible: false,
    };
  },
  created() {
    const isFirstLogin = localStorage.getItem('is-first-login');
    if (!isFirstLogin) {
      this.visible = true;
    }
    localStorage.setItem('is-first-login', 1);
  },
});
</script>

<style lang="scss" scoped>
.modal{
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  background-color: #0000003b;
}
.box-tips {
  position: absolute;
  left: 70px;
  top: 55px;
  width: 360px;
  background-color: white;
  box-shadow: 0px 2px 4px 0px rgb(54 58 80 / 30%);
  padding: 8px;
  .title{
    font-weight: bold;
  }
  .item{
    padding-left: 5px;
    margin-top: 5px;
  }
  .opt{
    text-align: center;
  }
}
</style>
