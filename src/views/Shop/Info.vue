<template>
  <div class="shopInfo w-full h-full p-4 pb-32 overflow-y-auto">
    <div class="container w-full p-8 mx-auto border-[1px] rounded-md bg-white">
      <div class="PAN grid grid-cols-2 gap-4 min-h-40">
        <div class="promotion">
          <div
            class="title flex items-center py-4 font-bold text-left text-xl text-[--info-text-color]"
          >
            <div class="line w-1 h-6 rounded-md bg-[--theme-color]"></div>
            <div class="text px-4">店铺活动</div>
            <div
              class="more px-4 py-1.5 ml-auto text-sm font-normal border-[1px] border-[var(--info-border-color)] hover:bg-[var(--info-bg-color)] transition-all duration-300 cursor-pointer"
            >
              查看更多
              <el-icon><ArrowRightBold /></el-icon>
            </div>
          </div>
          <div class="list grid grid-cols-2 gap-4">
            <div
              class="promotion-item relative flex flex-col p-4 text-left border-[1px] border-[var(--info-border-color)] hover:bg-[var(--info-bg-color)] transition-all duration-300 cursor-pointer"
            >
              <div class="title text-sm font-bold mb-2">
                2024年秋季清仓大甩卖
              </div>
              <div class="desc text-xs truncate">
                2024年秋季清仓大甩卖, 全场8.5折，买一送一
              </div>
              <div
                class="more absolute top-1/2 right-8 translate-y-[-50%] transition-all duration-300"
              >
                <el-icon><ArrowRightBold /></el-icon>
              </div>
            </div>
            <div
              class="promotion-item relative flex flex-col p-4 text-left border-[1px] border-[var(--info-border-color)] hover:bg-[var(--info-bg-color)] transition-all duration-300 cursor-pointer"
            >
              <div class="title text-sm font-bold mb-2">
                2024年秋季清仓大甩卖
              </div>
              <div class="desc text-xs truncate">
                2024年秋季清仓大甩卖, 全场8.5折，买一送一
              </div>
              <div
                class="more absolute top-1/2 right-8 translate-y-[-50%] transition-all duration-300"
              >
                <el-icon><ArrowRightBold /></el-icon>
              </div>
            </div>
            <div
              class="promotion-item relative flex flex-col p-4 text-left border-[1px] border-[var(--info-border-color)] hover:bg-[var(--info-bg-color)] transition-all duration-300 cursor-pointer"
            >
              <div class="title text-sm font-bold mb-2">
                2024年秋季清仓大甩卖
              </div>
              <div class="desc text-xs truncate">
                2024年秋季清仓大甩卖, 全场8.5折，买一送一
              </div>
              <div
                class="more absolute top-1/2 right-8 translate-y-[-50%] transition-all duration-300"
              >
                <el-icon><ArrowRightBold /></el-icon>
              </div>
            </div>
          </div>
        </div>
        <div class="notice">
          <div
            class="title flex items-center py-4 font-bold text-left text-xl text-[--info-text-color]"
          >
            <div class="line w-1 h-6 rounded-md bg-[--theme-color]"></div>
            <div class="text px-4">店铺公告</div>
            <div
              class="more px-4 py-1.5 ml-auto text-sm font-normal border-[1px] border-[var(--info-border-color)] hover:bg-[var(--info-bg-color)] transition-all duration-300 cursor-pointer"
            >
              查看更多
              <el-icon><ArrowRightBold /></el-icon>
            </div>
          </div>
          <div class="list grid grid-cols-2 gap-4">
            <div
              class="notice-item p-2 text-left border-[1px] border-[var(--info-border-color)] hover:bg-[var(--info-bg-color)] transition-all duration-300 cursor-pointer"
            >
              <div class="head mb-4">
                <el-tag type="primary">{{ currentShop.shop_name }}</el-tag>
                <span class="ml-2 text-sm font-bold hover:underline"
                  >2024秋季大清仓</span
                >
              </div>
              <div class="time text-right text-xs">2024-08-27</div>
            </div>
            <div
              class="notice-item p-2 text-left border-[1px] border-[var(--info-border-color)] hover:bg-[var(--info-bg-color)] transition-all duration-300 cursor-pointer"
            >
              <div class="head mb-4">
                <el-tag type="primary">{{ currentShop.shop_name }}</el-tag>
                <span class="ml-2 text-sm font-bold hover:underline"
                  >2024秋季大清仓</span
                >
              </div>
              <div class="time text-right text-xs">2024-08-27</div>
            </div>
            <div
              class="notice-item p-2 text-left border-[1px] border-[var(--info-border-color)] hover:bg-[var(--info-bg-color)] transition-all duration-300 cursor-pointer"
            >
              <div class="head mb-4">
                <el-tag type="primary">{{ currentShop.shop_name }}</el-tag>
                <span class="ml-2 text-sm font-bold hover:underline"
                  >2024秋季大清仓</span
                >
              </div>
              <div class="time text-right text-xs">2024-08-27</div>
            </div>
            <div
              class="notice-item p-2 text-left border-[1px] border-[var(--info-border-color)] hover:bg-[var(--info-bg-color)] transition-all duration-300 cursor-pointer"
            >
              <div class="head mb-4">
                <el-tag type="primary">{{ currentShop.shop_name }}</el-tag>
                <span class="ml-2 text-sm font-bold hover:underline"
                  >2024秋季大清仓</span
                >
              </div>
              <div class="time text-right text-xs">2024-08-27</div>
            </div>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="coupon">
        <div
          class="title flex items-center py-4 font-bold text-left text-xl text-[--info-text-color]"
        >
          <div class="line w-1 h-6 rounded-md bg-[--theme-color]"></div>
          <div class="text px-4">店铺优惠券</div>
        </div>
        <div
          class="couponList grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10 p-4 px-10"
        >
          <Coupon :coupon></Coupon>
          <Coupon :coupon></Coupon>
          <Coupon :coupon></Coupon>
          <Coupon :coupon></Coupon>
          <Coupon :coupon></Coupon>
        </div>
      </div>
      <el-divider></el-divider>
      <div class="shopInfo">
        <div
          class="title flex items-center py-4 font-bold text-left text-xl text-[--info-text-color]"
        >
          <div class="line w-1 h-6 rounded-md bg-[--theme-color]"></div>
          <div class="text px-4">店铺信息</div>
        </div>
        <div class="info">
          <el-descriptions class="margin-top" size="large" border>
            <el-descriptions-item :rowspan="3">
              <template #label>店铺图片</template>
              <template #default>
                <div class="cell-item w-full h-full min-w-80">
                  <el-carousel
                    :interval="5000"
                    indicator-position="none"
                    style="width: 100%; height: 100%"
                  >
                    <el-carousel-item v-for="item in 4" :key="item">
                      <h3 text="2xl" justify="center">{{ item }}</h3>
                    </el-carousel-item>
                  </el-carousel>
                </div>
              </template>
            </el-descriptions-item>
            <el-descriptions-item :span="1" :rowspan="1">
              <template #label>
                <div class="cell-item flex items-center">店铺名称</div>
              </template>
              <template #default>
                <div class="text min-w-32">{{ currentShop?.shop_name }}</div>
              </template>
            </el-descriptions-item>
            <el-descriptions-item :span="1" :rowspan="1">
              <template #label>
                <div class="cell-item flex items-center">联系电话</div>
              </template>
              <template #default>
                <div class="text min-w-32">{{ currentShop?.phone }}</div>
              </template>
            </el-descriptions-item>
            <el-descriptions-item :span="1" :rowspan="1">
              <template #label>
                <div class="cell-item flex items-center">店铺地址</div>
              </template>
              <template #default>
                <div class="text min-w-32">{{ currentShop?.location }}</div>
              </template>
            </el-descriptions-item>
            <el-descriptions-item :span="1" :rowspan="1">
              <template #label>
                <div class="cell-item flex items-center">店铺状态</div>
              </template>
              <template #default>
                <div class="text min-w-32">
                  <el-tag
                    :type="
                      currentShop?.status === 'Active'
                        ? 'success'
                        : currentShop?.status === 'Inactive'
                        ? 'primary'
                        : 'danger'
                    "
                    >{{
                      currentShop?.status === "Active"
                        ? "正常营业"
                        : currentShop?.status === "Inactive"
                        ? "待审核"
                        : "已注销"
                    }}</el-tag
                  >
                </div>
              </template>
            </el-descriptions-item>
            <el-descriptions-item>
              <template #label>店铺简介</template>
              <template #default>
                <div class="cell-item">
                  {{ currentShop?.shop_description }}
                </div>
              </template>
            </el-descriptions-item>
          </el-descriptions>
        </div>
      </div>
      <el-divider></el-divider>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, inject, onBeforeMount, watchEffect } from "vue";
import Coupon from "@/components/Coupon/Coupon.vue";
import { userShopStore } from "@/store/index";
import Shop from "@/model/Shop";
import { Axios } from "axios";

// 注入axios
const axios: Axios = inject("axios") as Axios; /// axios 实例
// 店铺数据存储库
const shopStore = userShopStore();
// 当前店铺
const currentShop = ref<Shop>(shopStore.currentShop);
// 图片预览组件显隐开关
// const showImageViewer = ref(false);

const coupon = {
  type: "优惠券",
  price: 20,
  condition: "全店满99可用",
  timeRange: "6/05-6/10",
};

// 图片预览组件关闭回调
// const closeViewer = () => {
//   showImageViewer.value = false;
// };

// 获取店铺数据
const getShop = async () => {
  await axios.get("/shops/" + currentShop.value?.shop_id).then((res) => {
    currentShop.value = res.data.data;
  });
};

onBeforeMount(async () => {
  await getShop();
});
watchEffect(() => {
  currentShop.value = shopStore.currentShop;
});
</script>
<style lang="scss" scoped>
.promotion-item {
  &:hover {
    .more {
      right: 24px;
    }
  }
}
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 300px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
