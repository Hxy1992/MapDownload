<template>
  <n-icon
    size="20"
    title="显示瓦片网格"
    style="cursor: pointer;"
    :color="gridColor"
    @click="handleGridClick"
  >
    <svg
      t="1650436523116"
      class="icon"
      viewBox="0 0 1027 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      p-id="2577"
      width="200"
      height="200"
    ><path
      d="M977.6 555.2c25.6 0 43.2-17.6 43.2-43.2s-17.6-43.2-43.2-43.2h-84.8v-256h84.8c25.6 0 43.2-17.6 43.2-43.2S1003.2 128 977.6 128h-84.8V43.2c0-25.6-17.6-43.2-43.2-43.2s-43.2 17.6-43.2 43.2V128h-256V43.2c1.6-25.6-16-43.2-41.6-43.2s-43.2 17.6-43.2 43.2V128h-256V43.2C209.6 17.6 192 0 166.4 0S128 17.6 128 43.2V128H43.2C17.6 128 0 145.6 0 171.2s17.6 43.2 43.2 43.2H128v256H43.2C17.6 468.8 0 486.4 0 512s17.6 43.2 43.2 43.2H128v256H43.2c-25.6 0-43.2 17.6-43.2 43.2C0 878.4 17.6 896 43.2 896H128v84.8c0 25.6 17.6 43.2 43.2 43.2s43.2-17.6 43.2-43.2V896h256v84.8c0 25.6 17.6 43.2 43.2 43.2s43.2-17.6 43.2-43.2V896h256v84.8c0 25.6 17.6 43.2 43.2 43.2s43.2-17.6 43.2-43.2V896h84.8c25.6 0 43.2-17.6 43.2-43.2s-17.6-43.2-43.2-43.2H896v-256h84.8v1.6zM808 212.8v256h-256v-256h256z m-595.2 0h256v256h-256v-256z m0 598.4v-256h256v256h-256z m595.2 0h-256v-256h256v256z"
      p-id="2578"
    /></svg>
  </n-icon>
</template>

<script >
import {defineComponent} from 'vue';
export default defineComponent({
  name: 'GridIcon',
  emits: ['showGrid'],
  data() {
    return {
      showGrid: false,
      gridColor: '#333333',
    };
  },
  methods: {
    handleGridClick() {
      this.showGrid = !this.showGrid;
      this.gridColor = this.showGrid ? '#2080f0' : '#333333';
      this.$emit('showGrid', this.showGrid);
    },
  },
});
</script>
