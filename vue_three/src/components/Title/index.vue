<template>
  <div class="title-container">
    <div class="title">
      NFT体验馆{{pageName}}
    </div>
  </div>
</template>
<script setup lang="ts">
  import { pageStore } from "@/store/user";
  const pageName=pageStore().pagename
</script>
<style lang="less" scoped>
.title-container {
  width: 750px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  .title {
    width: 170px;
    height: 48px;
    font-size: 34px;
    color: #fff;
    white-space: nowrap;
    line-height: @titleLineHeight;
    margin: @titleMarginTop auto @titleMarginBottom;
  }
}
</style>