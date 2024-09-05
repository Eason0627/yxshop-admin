// 导入pinia
import { defineStore } from "pinia";
import { RouteLocationNormalized } from "vue-router";

export const userShopStore = defineStore("ShopInfo", {
  state: () => ({
    currentShop: JSON.parse(localStorage.getItem("currentShop") || "{}"),
    shopList: [],
  }),
  getters: {
    getCurrentShop: (state) => state.currentShop,
    getShopList: (state) => {
      return state.shopList;
    },
  },
  actions: {
    setCurrentShop(shop: any) {
      localStorage.setItem("currentShop", JSON.stringify(shop));
      this.currentShop = shop;
    },
    setShopList(shopList: any) {
      this.shopList = shopList;
    },
  },
});

export const useRememberMeStore = defineStore("rememberMe", {
  state: () => ({
    rememberMe: false,
  }),
  getters: {
    getRememberMe: (state) => state.rememberMe,
  },
  actions: {
    setRememberMe(value: boolean) {
      this.rememberMe = value;
    },
  },
});

export const useRouterHistoryStore = defineStore("routerHistory", {
  state: () => ({
    historyStack:
      ([] as RouteLocationNormalized[]) || localStorage.getItem("routerList"), // 存储历史路由的 fullPath
  }),
  actions: {
    pushToHistory(router: RouteLocationNormalized) {
      // 遍历历史路由对象，当前添加路由不存在时添加，存在时不进行操作
      const index = this.historyStack.findIndex(
        (item) => item.fullPath === router.fullPath
      );
      if (index == -1) {
        this.historyStack.push(router);
        // 获取本地存储的路由数组
        let routerList = JSON.parse(localStorage.getItem("routerList") || "[]");
        routerList = this.historyStack;
      }
    },
    popFromHistory() {
      this.historyStack.pop();
      // 获取本地存储的路由数组
      let routerList = JSON.parse(localStorage.getItem("routerList") || "[]");
      routerList = this.historyStack;
    },
    removeHistory(router: RouteLocationNormalized) {
      // 根据 router.fullPath 删除对应的路由对象
      const index = this.historyStack.findIndex(
        (item) => item.fullPath === router.fullPath
      );
      if (index !== -1) {
        this.historyStack.splice(index, 1);
        let routerList = JSON.parse(localStorage.getItem("routerList") || "[]");
        routerList = this.historyStack;
      }
    },
    clearHistory() {
      // 使用 splice 方法清空数组
      this.historyStack.splice(0, this.historyStack.length);
    },
  },
});
