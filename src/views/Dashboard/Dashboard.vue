<template>
  <div class="dashboard w-full h-full p-3 pb-24 overflow-y-auto">
    <div class="content flex w-full h-full">
      <div class="left flex-1 h-full mr-2">
        <div class="common w-full p-4 bg-white">
          <!-- 搜索功能 -->
          <div class="search flex items-center w-full">
            <div class="input w-full">
              <input
                class="w-full py-2 text-sm border-b-[1px] border-b-[var(--info-bg-color)] focus-visible:outline-0 focus-visible:shadow-none focus-visible:border-b-[1px] focus-visible:border-b-[var(--theme-color)] transition-all duration-300"
                type="text"
                placeholder="请输入想要查找的功能"
              />
            </div>
            <div class="searchIcon ml-[-20px]">
              <el-icon><Search /></el-icon>
            </div>
          </div>
          <!-- 最近访问 -->
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
          <!-- 我的店铺 & 我的审核 -->
          <div class="shop_and_process mt-6">
            <div class="nav flex items-center">
              <div
                class="nav_item p-2 mx-2 border-b-2 border-b-transparent cursor-pointer hover:border-b-2 hover:border-b-[var(--theme-color)] transition-all duration-300"
                :class="
                  nav_active === 0
                    ? 'font-bold border-b-2 border-b-[var(--theme-color)]'
                    : ''
                "
                @click="nav_active = 0"
              >
                <span>我的店铺</span>
              </div>
              <div
                class="nav_item p-2 mx-2 border-b-2 border-b-transparent cursor-pointer hover:border-b-2 hover:border-b-[var(--theme-color)] transition-all duration-300"
                :class="
                  nav_active === 1
                    ? 'font-bold border-b-2 border-b-[var(--theme-color)]'
                    : ''
                "
                @click="nav_active = 1"
              >
                <span>我的审核</span>
              </div>
            </div>
            <div class="content min-h-24 w--full overflow-hidden">
              <Transition name="shop">
                <div
                  class="shop_content w-full h-full"
                  v-show="nav_active === 0"
                >
                  <div class="empty w-full h-full" v-if="!shop_list.length">
                    暂无店铺
                  </div>
                  <div class="list"></div>
                </div>
              </Transition>
              <Transition name="process">
                <div
                  class="process_content w-full h-full"
                  v-show="nav_active === 1"
                >
                  <div class="empty w-full h-full" v-if="!process_list.length">
                    暂无审核
                  </div>
                  <div class="list"></div>
                </div>
              </Transition>
            </div>
          </div>
        </div>
        <!-- 订单总数 & 店铺评价 -->
        <div class="order_and_evaluate grid grid-cols-2 gap-4 w-full mt-6">
          <div class="order p-4 bg-white">
            <div class="title flex item-center justify-between py-2">
              <div class="text py-1.5 font-bold">
                <span>订单总数</span>
              </div>
              <div
                class="more flex items-center px-4 py-1 text-sm border-[1px] border-solid border-[var(--info-border-color)] hover:bg-[var(--info-bg-color)] transition-all duration-300 cursor-pointer"
              >
                <span class="mr-2">查看更多</span>
                <el-icon><Right /></el-icon>
              </div>
            </div>
            <div class="content"></div>
          </div>
          <div class="evaluate p-4 bg-white">
            <div class="title flex item-center justify-between py-2">
              <div class="text py-1 font-bold">
                <span>店铺评分</span>
              </div>
              <div
                class="more flex items-center px-4 py-1.5 text-sm border-[1px] border-solid border-[var(--info-border-color)] hover:bg-[var(--info-bg-color)] transition-all duration-300 cursor-pointer"
              >
                <span class="mr-2">查看更多</span>
                <el-icon><Right /></el-icon>
              </div>
            </div>
            <div class="content"></div>
          </div>
        </div>
        <!-- 促销推荐 -->
        <div class="suggest"></div>
        <!-- 库存预警 -->
        <div class="waring"></div>
      </div>
      <div class="right w-1/4 h-full bg-white">
        <div class="user">
          <div class="userInfo"></div>
        </div>
        <!-- 促销活动 -->
        <div class="promotion"></div>
        <!-- 销售统计 -->
        <div class="salesInfo"></div>
        <!-- 售后服务 -->
        <div class="Post-Sale"></div>
        <!-- 平台公告 -->
        <div class="notice"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from "vue";

// 最近访问数组
const recently_list = reactive([
  "商品列表",
  "订单列表",
  "物流管理",
  "销售数据",
  "促销效果",
  "店铺信息",
]);

// 店铺 & 审核 切换控制变量
const nav_active = ref(0);

// 我的店铺
const shop_list = ref([]);

// 我的审核
const process_list = ref([]);
</script>
<style lang="scss" scoped>
.shop-enter-active,
.shop-leave-active {
  transition: all 0.5s ease;
}

.shop-enter-from,
.shop-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.shop-leave-to {
  display: none; // 解决过渡动画抖动
}

.process-enter-active,
.process-leave-active {
  transition: all 0.5s ease;
}

.process-enter-from,
.process-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.process-leave-to {
  display: none;
}
</style>
