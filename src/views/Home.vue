<template>
  <div class="home flex w-full h-full">
    <Aside :navigation></Aside>
    <div class="content flex-1">
      <TopTools></TopTools>
      <HistoryRouter></HistoryRouter>
      <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import { NavigationItem } from "@/components/Aside/Aside.interface";
import Aside from "@/components/Aside/Aside.vue";
import TopTools from "@/components/TopTools/TopTools.vue";
import HistoryRouter from "@/components/HistoryRouter/HistoryRouter.vue";
const navigation: NavigationItem[] = [
  {
    url: "/home",
    name: "数据看板",
    left_icon: "&#xe629;",
    right_icon: "&#xe632;",
    children: [
      {
        url: "/home/dashboard",
        name: "店铺工作台",
        right_icon: "&#xe632;",
        children: [],
      },
      {
        url: "/home/marketing",
        name: "销售数据",
        right_icon: "&#xe632;",
        children: [],
      },
    ],
  },
  {
    url: "/product",
    name: "商品管理",
    left_icon: "&#xe602;",
    right_icon: "&#xe632;",
    children: [
      {
        url: "/product/category",
        name: "商品分类",
        right_icon: "&#xe632;",
        children: [],
      },
      {
        url: "/product/list",
        name: "商品列表",
        right_icon: "&#xe632;",
        children: [
          {
            url: "/product/publish",
            name: "发布商品",
            right_icon: "&#xe632;",
            children: [],
          },
        ],
      },
    ],
  },
  {
    url: "/order",
    name: "订单管理",
    left_icon: "&#xe708;",
    right_icon: "&#xe632;",
    children: [
      {
        url: "/order/list",
        name: "订单列表",
        right_icon: "&#xe632;",
        children: [],
      },
      {
        url: "/order/delivery",
        name: "物流管理",
        left_icon: "&#xe705;",
        right_icon: "&#xe632;",
        children: [
          {
            url: "/order/delivery/list",
            name: "物流货单",
            right_icon: "&#xe632;",
            children: [],
          },
          {
            url: "/order/delivery/add",
            name: "发货处理",
            right_icon: "&#xe632;",
            children: [],
          },
        ],
      },
    ],
  },
  {
    url: "/afterSales",
    name: "售后服务",
    left_icon: "&#xe6f8;",
    right_icon: "&#xe632;",
    children: [
      {
        url: "/afterSales/list",
        name: "待处理",
        right_icon: "&#xe632;",
        children: [],
      },
      {
        url: "/afterSales/refund",
        name: "退货退款",
        right_icon: "&#xe632;",
        children: [],
      },
    ],
  },
  {
    url: "/promotion",
    name: "促销活动",
    left_icon: "&#xe600;",
    right_icon: "&#xe632;",
    children: [
      {
        url: "/promotion/category",
        name: "活动分类",
        right_icon: "&#xe632;",
        children: [],
      },
      {
        url: "/promotion/list",
        name: "活动列表",
        right_icon: "&#xe632;",
        children: [],
      },
      {
        url: "/promotion/effect",
        name: "效果监控",
        right_icon: "&#xe632;",
        children: [],
      },
    ],
  },
  {
    url: "/coupon",
    name: "优惠券管理",
    left_icon: "&#xe610;",
    right_icon: "&#xe632;",
    children: [
      {
        url: "/coupon/category",
        name: "优惠券分类",
        right_icon: "&#xe632;",
        children: [],
      },
      {
        url: "/coupon/list",
        name: "优惠券列表",
        right_icon: "&#xe632;",
        children: [],
      },
    ],
  },
  {
    url: "/shop",
    name: "店铺管理",
    left_icon: "&#xe678;",
    right_icon: "&#xe632;",
    children: [
      {
        url: "/shop/list",
        name: "店铺列表",
        right_icon: "&#xe632;",
        children: [],
      },
      {
        url: "/shop/info",
        name: "店铺信息",
        right_icon: "&#xe632;",
        children: [],
      },
      {
        url: "/shop/custom",
        name: "店铺装修",
        right_icon: "&#xe632;",
        children: [],
      },
    ],
  },
  {
    url: "/brand",
    name: "品牌管理",
    left_icon: "&#xe612;",
    right_icon: "&#xe632;",
    children: [
      {
        url: "/brand/list",
        name: "品牌列表",
        right_icon: "&#xe612;",
        children: [],
      },
    ],
  },
  {
    url: "/process",
    name: "审核管理",
    left_icon: "&#xe7e2;",
    right_icon: "&#xe632;",
    children: [
      {
        url: "/process/list",
        name: "审核列表",
        right_icon: "&#xe612;",
        children: [],
      },
    ],
  },
  {
    url: "/warehouse",
    name: "仓储管理",
    left_icon: "&#xe706;",
    right_icon: "&#xe632;",
    children: [
      {
        url: "/warehouse/list",
        name: "仓库列表",
        right_icon: "&#xe632;",
        children: [],
      },
      {
        url: "/warehouse/wholesale",
        name: "进货单",
        right_icon: "&#xe632;",
        children: [],
      },
    ],
  },
  {
    url: "/user",
    name: "用户管理",
    left_icon: "&#xe61d;",
    right_icon: "&#xe632;",
    children: [
      {
        url: "/user/list",
        name: "用户列表",
        right_icon: "&#xe632;",
        children: [],
      },
      {
        url: "/user/role",
        name: "角色管理",
        right_icon: "&#xe632;",
        children: [],
      },
      {
        url: "/user/info",
        name: "用户信息",
        right_icon: "&#xe632;",
        children: [],
      },
    ],
  },
];
</script>
<style lang="scss" scoped></style>
