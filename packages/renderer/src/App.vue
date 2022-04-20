<template>
  <n-notification-provider>
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-notification-provider>
</template>

<script>
import {defineComponent} from 'vue';
export default defineComponent({
  name: 'App',
  setup() {
  },
});
</script>

<style>
</style>
