<template>
  <div
    v-if="visible"
    class="box-modal"
  >
    <div class="dialog">
      <div class="header">
        <span class="title">地图Key配置</span>
        <span
          class="close"
          @click="hide"
        >X</span>
      </div>
      <div class="content">
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
      <div class="footer">
        <button @click="hide">
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
import {getKeys, setKeys} from '/@/utils/map-key.js';
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
      tdtKey: '',
      mapboxKey: '',
    };
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
    hide() {
      // eslint-disable-next-line
      this.$emit('hide');
    },
    ok() {
      setKeys({
        tdtKey: this.tdtKey || '',
        mapboxKey: this.mapboxKey || '',
      });
      this.hide();
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
    padding: 8px;
    width: 450px;
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
