<template>
  <div class="recently mt-2">
    <div class="title w-full py-2 text-left text-sm">最近访问</div>
    <div class="list grid grid-cols-5 gap-3">
      <div
        class="list_item px-4 py-1.5 text-sm text-left bg-[var(--info-bg-color)] hover:bg-[var(--info-bg-hover-color)] transition-all duration-300 cursor-pointer"
        v-for="item in recently_list"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
// 最近访问数组
const recently_list = reactive([
  "商品列表",
  "订单列表",
  "物流管理",
  "销售数据",
  "促销效果",
  "店铺信息",
]);
</script>
<style lang="scss" scoped></style>
