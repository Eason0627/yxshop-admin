<template>
  <div class="suggest px-8 py-4 mt-4 bg-white">
    <div class="title flex item-center justify-between py-2">
      <div class="text py-1.5 font-bold">
        <span>促销推荐</span>
      </div>
      <div
        class="more flex items-center px-4 py-1 text-sm border-[1px] border-solid border-[var(--info-border-color)] hover:bg-[var(--info-bg-color)] transition-all duration-300 cursor-pointer"
      >
        <span class="mr-2">切换一组</span>
        <el-icon><Refresh /></el-icon>
      </div>
    </div>
    <div class="list grid grid-cols-2 gap-4">
      <div
        class="item relative flex flex-col p-4 text-left border-[1px] border-[var(--info-border-color)] hover:bg-[var(--info-bg-color)] transition-all duration-300 cursor-pointer"
        v-for="(item, index) in promotion_list"
        :key="index"
      >
        <div class="title text-sm font-bold mb-4">
          {{ item.title }}
        </div>
        <div class="desc text-xs">
          {{ item.desc }}
        </div>
        <div
          class="more absolute top-1/2 right-8 translate-y-[-50%] transition-all duration-300"
        >
          <el-icon><ArrowRightBold /></el-icon>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
// 促销方案
const promotion_list = reactive([
  {
    title: "【推荐】2023年春季新款女装",
    desc: "2023年春季新款女装，全场8折优惠，全场包邮",
  },
  {
    title: "【推荐】2023年春季新款女装",
    desc: "2023年春季新款女装，全场8折优惠，全场包邮",
  },
  {
    title: "【推荐】2023年春季新款女装",
    desc: "2023年春季新款女装，全场8折优惠，全场包邮",
  },
  {
    title: "【推荐】2023年春季新款女装",
    desc: "2023年春季新款女装，全场8折优惠，全场包邮",
  },
]);
</script>
<style lang="scss" scoped>
.item {
  &:hover {
    .more {
      right: 24px;
    }
  }
}
</style>
