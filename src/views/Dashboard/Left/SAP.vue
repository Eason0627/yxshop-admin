<template>
  <!-- 我的店铺 & 我的审核 -->
  <div class="shop_and_process mt-6">
    <div class="nav flex items-center">
      <div
        class="nav_item p-2 mx-2 border-b-2 border-b-transparent cursor-pointer hover:border-b-2 hover:border-b-[var(--theme-color)] transition-all duration-300"
        :style="{
          font: nav_active === 0 ? 'font-bold' : '',
          borderBottom: nav_active === 0 ? '2px solid var(--theme-color)' : '',
        }"
        @click="nav_active = 0"
      >
        <span>我的店铺</span>
      </div>
      <div
        class="nav_item p-2 mx-2 border-b-2 border-b-transparent cursor-pointer hover:border-b-2 hover:border-b-[var(--theme-color)] transition-all duration-300"
        :style="{
          font: nav_active === 1 ? 'font-bold' : '',
          borderBottom: nav_active === 1 ? '2px solid var(--theme-color)' : '',
        }"
        @click="nav_active = 1"
      >
        <span>我的审核</span>
      </div>
    </div>
    <div class="content min-h-32 w-full mt-4 overflow-hidden">
      <Transition name="shop">
        <div class="shop_content w-full h-full" v-show="nav_active === 0">
          <div class="empty w-full h-full" v-if="!shop_list.length">
            暂无店铺
          </div>
          <div class="list grid grid-cols-3 px-[1px]">
            <div
              class="item relative flex p-4 mr-[-1px] border-[1px] border-[--info-border-color] hover:bg-[var(--info-bg-color)] transition-all duration-300 cursor-pointer"
              v-for="(item, index) in shop_list"
              :key="index"
            >
              <div class="left w-16 h-16 mr-2">
                <div class="img w-full h-full overflow-hidden">
                  <img
                    :src="item.shop_image ? item.shop_image : defaultShopImage"
                    alt=""
                  />
                </div>
              </div>
              <div class="right flex-1 flex flex-col text-left">
                <div class="title font-bold">{{ item.shop_name }}</div>
                <div class="location mt-4 text-sm">
                  注册时间：{{
                    new Date(item.registration_date).toLocaleString()
                  }}
                </div>
                <div
                  class="status absolute top-0 right-0 px-2 py-1 text-sm text-white"
                  :style="{
                    backgroundColor:
                      item.status === 0
                        ? 'var(--success-color)'
                        : item.status === 1
                        ? 'var(--warning-color)'
                        : 'var(--error-color)',
                  }"
                >
                  {{
                    item.status === 0
                      ? "营业"
                      : item.status === 1
                      ? "待审核"
                      : "已关闭"
                  }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      <Transition name="process">
        <div class="process_content w-full h-full" v-show="nav_active === 1">
          <div class="empty w-full h-full" v-if="!process_list.length">
            暂无审核
          </div>
          <div class="list"></div>
        </div>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, inject } from "vue";
import Shop, { Status } from "@/model/Shop";

const defaultShopImage = inject("defaultShopImage") as string;

// 店铺 & 审核 切换控制变量
const nav_active = ref(0);

// 我的店铺
const shop_list = reactive<Shop[]>([
  {
    shop_id: 1,
    shop_name: "测试店铺",
    owner_user_id: 1,
    phone: "12345678901",
    location: "测试地址",
    registration_date: new Date(),
    shop_description: "测试店铺描述",
    shop_image: "https://picsum.photos/200/300",
    status: Status.Active,
  },
  {
    shop_id: 2,
    shop_name: "测试店铺",
    owner_user_id: 1,
    phone: "12345678901",
    location: "测试地址",
    registration_date: new Date(),
    shop_description: "测试店铺描述",
    shop_image: "https://picsum.photos/200/300",
    status: Status.Inactive,
  },
  {
    shop_id: 3,
    shop_name: "测试店铺",
    owner_user_id: 1,
    phone: "12345678901",
    location: "测试地址",
    registration_date: new Date(),
    shop_description: "测试店铺描述",
    shop_image: "https://picsum.photos/200/300",
    status: Status.Invalid,
  },
]);

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
