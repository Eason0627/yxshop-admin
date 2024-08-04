import { useRouterHistoryStore } from "@/store";
import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "/home",
        redirect: "/home/dashboard",
      },
      {
        path: "/home/dashboard",
        name: "商铺工作台",
        component: () => import("@/views/Dashboard/Dashboard.vue"),
      },
      {
        path: "/home/marketing",
        name: "销售数据",
        component: () => import("@/views/Marketing/Marketing.vue"),
      },
    ],
  },
  {
    path: "/product",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "/product",
        redirect: "/product/list",
      },
      {
        path: "/product/list",
        name: "商品列表",
        component: () => import("@/views/Product/List.vue"),
      },
      {
        path: "/product/category",
        name: "商品分类",
        component: () => import("@/views/Product/Category.vue"),
      },
      {
        path: "/product/publish",
        name: "发布商品",
        component: () => import("@/views/Product/Publish.vue"),
      },
    ],
  },
  {
    path: "/order",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "/order",
        redirect: "/order/list",
      },
      {
        path: "/order/list",
        name: "订单列表",
        component: () => import("@/views/Order/List.vue"),
      },
      {
        path: "/order/delivery",
        name: "物流管理",
        component: () => import("@/views/Order/Delivery/Delivery.vue"),
        children: [
          {
            path: "/order/delivery/list",
            name: "物流货单",
            component: () => import("@/views/Order/Delivery/List.vue"),
          },
          {
            path: "/order/delivery/add",
            name: "发货处理",
            component: () => import("@/views/Order/Delivery/Add.vue"),
          },
        ],
      },
    ],
  },
  {
    path: "/afterSales",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "/afterSales",
        redirect: "/afterSales/list",
      },
      {
        path: "/afterSales/list",
        name: "待处理",
        component: () => import("@/views/AfterSales/List.vue"),
      },
      {
        path: "/afterSales/refund",
        name: "退货退款",
        component: () => import("@/views/AfterSales/Refund.vue"),
      },
    ],
  },
  {
    path: "/promotion",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "/promotion",
        redirect: "/promotion/list",
      },
      {
        path: "/promotion/list",
        name: "营销活动",
        component: () => import("@/views/Promotion/List.vue"),
      },
      {
        path: "/promotion/category",
        name: "活动分类",
        component: () => import("@/views/Promotion/Category.vue"),
      },
      {
        path: "/promotion/effect",
        name: "活动效果",
        component: () => import("@/views/Promotion/Effect.vue"),
      },
    ],
  },
  {
    path: "/coupon",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "/coupon",
        redirect: "/coupon/list",
      },
      {
        path: "/coupon/list",
        name: "优惠券列表",
        component: () => import("@/views/Coupon/List.vue"),
      },
      {
        path: "/coupon/category",
        name: "优惠券分类",
        component: () => import("@/views/Coupon/Category.vue"),
      },
    ],
  },
  {
    path: "/shop",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "/shop",
        redirect: "/shop/list",
      },
      {
        path: "/shop/list",
        name: "店铺列表",
        component: () => import("@/views/Shop/List.vue"),
      },
      {
        path: "/shop/info",
        name: "店铺信息",
        component: () => import("@/views/Shop/Info.vue"),
      },
      {
        path: "/shop/custom",
        name: "店铺装修",
        component: () => import("@/views/Shop/Custom.vue"),
      },
    ],
  },
  {
    path: "/warehouse",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "/warehouse",
        redirect: "/warehouse/list",
      },
      {
        path: "/warehouse/list",
        name: "仓库列表",
        component: () => import("@/views/Warehouse/List.vue"),
      },
      {
        path: "/warehouse/wholesale",
        name: "出库入库",
        component: () => import("@/views/Warehouse/Wholesale.vue"),
      },
    ],
  },
  {
    path: "/user",
    component: () => import("@/views/Home.vue"),
    children: [
      {
        path: "/user",
        redirect: "/user/list",
      },
      {
        path: "/user/list",
        name: "用户列表",
        component: () => import("@/views/User/List.vue"),
      },
      {
        path: "/user/role",
        name: "角色管理",
        component: () => import("@/views/User/Role.vue"),
      },
      {
        path: "/user/info",
        name: "用户信息",
        component: () => import("@/views/User/Info.vue"),
      },
    ],
  },
  { path: "/:pathMatch(.*)*", component: () => import("@/views/NotFound.vue") },
  { path: "/login", component: () => import("@/views/Login.vue") },
];

// 导航拦截守卫
const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  // 获取 token
  const token = localStorage.getItem("token") || "";
  if (to.path === "/login") {
    next();
  } else {
    if (token) {
      next();
    } else {
      next("/login");
    }
  }
  const routeHistory = useRouterHistoryStore();
  // 将当前路由添加到历史记录
  routeHistory.pushToHistory(to);
});

export default router;
