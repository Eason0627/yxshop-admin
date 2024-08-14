<template>
  <div class="dashboard w-full h-full p-3 pb-24 overflow-y-auto">
    <div class="container mx-auto flex w-full">
      <div class="left flex-1 h-full mr-6">
        <div class="common w-full p-4 bg-white">
          <!-- 搜索功能 -->
          <Search></Search>
          <!-- 最近访问 -->
          <Recently></Recently>
          <!-- 我的店铺 & 我的审核 -->
          <SAP></SAP>
        </div>
        <!-- 订单总数 & 店铺评价 -->
        <OAE></OAE>
        <!-- 库存预警 -->
        <Warning></Warning>
        <!-- 促销推荐 -->
        <Suggest></Suggest>
      </div>
      <div class="right w-2/6 h-full">
        <!-- 用户信息 -->
        <User></User>
        <!-- 促销活动 -->
        <Promotion></Promotion>
        <!-- 售后服务 -->
        <PostSale></PostSale>
        <!-- 销售统计 -->
        <Sales></Sales>
        <!-- 平台公告 -->
        <Notice></Notice>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import Search from "./Left/Search.vue"; // 搜索模块
import Recently from "./Left/Recently.vue"; // 最近访问模块
import SAP from "./Left/SAP.vue"; // 店铺和审核模块
import OAE from "./Left/OAE.vue"; // 订单和评价模块
import Suggest from "./Left/Suggest.vue"; // 促销方案模块
import Warning from "./Left/Warning.vue"; // 库存预警模块

import User from "./Right/User.vue"; // 用户信息模块
import Promotion from "./Right/Promotion.vue"; // 平台促销活动模块
import Sales from "./Right/Sales.vue"; // 店铺销售统计模块
import PostSale from "./Right/PostSale.vue"; // 售后服务模块
import Notice from "./Right/Notice.vue"; // 公告模块
</script>
<style lang="scss" scoped></style>
