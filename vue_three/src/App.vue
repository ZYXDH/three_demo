<template>
  <div name="app">
    <router-view />
  </div>
</template>

<script setup="props" lang="ts">
  
</script>

<style scoped lang="less">
.app-enter-active,
.app-leave-active {
  transition: all 1s ease;
}

.app-enter-from{
  transform: translateX(100vw);
  opacity: 0;
}
.app-leave-to {
  transform: translateX(100vw);
  opacity: 0;
}
</style>
