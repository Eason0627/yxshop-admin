<template>
  <div class="Post-Sale p-8 mt-4 bg-white">
    <div class="head">
      <div class="title font-bold text-lg text-left">售后服务</div>
    </div>
    <div class="content mt-4">
      <div class="list mx-4 grid grid-cols-2 gap-4 text-left">
        <div
          class="item px-8 py-4 bg-[--info-bg-color] cursor-pointer hover:bg-[--info-bg-hover-color] transition-all duration-300]"
        >
          <div class="text mb-2 text-sm">退货退款</div>
          <div class="num font-bold text-xl">{{ 0 }}</div>
        </div>
        <div
          class="item px-8 py-4 bg-[--info-bg-color] cursor-pointer hover:bg-[--info-bg-hover-color] transition-all duration-300]"
        >
          <div class="text mb-2 text-sm">仅退货</div>
          <div class="num font-bold text-xl">{{ 0 }}</div>
        </div>
        <div
          class="item px-8 py-4 bg-[--info-bg-color] cursor-pointer hover:bg-[--info-bg-hover-color] transition-all duration-300]"
        >
          <div class="text mb-2 text-sm">仅退款</div>
          <div class="num font-bold text-xl">{{ 0 }}</div>
        </div>
        <div
          class="item px-8 py-4 bg-[--info-bg-color] cursor-pointer hover:bg-[--info-bg-hover-color] transition-all duration-300]"
        >
          <div class="text mb-2 text-sm">退换货</div>
          <div class="num font-bold text-xl">{{ 0 }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped></style>
