// 导入pinia
import { defineStore } from "pinia";
import { RouteLocationNormalized } from "vue-router";

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
    historyStack: [] as RouteLocationNormalized[], // 存储历史路由的 fullPath
  }),
  actions: {
    pushToHistory(router: RouteLocationNormalized) {
      // 遍历历史路由对象，当前添加路由不存在时添加，存在时不进行操作
      const index = this.historyStack.findIndex((item) => item.fullPath === router.fullPath); 
      if(index == -1) {
        this.historyStack.push(router);
      }
    },
    popFromHistory() {
      this.historyStack.pop();
    },
    removeHistory(router: RouteLocationNormalized) {
      // 根据 router.fullPath 删除对应的路由对象
      const index = this.historyStack.findIndex((item) => item.fullPath === router.fullPath);
      if(index !== -1) {
        this.historyStack.splice(index, 1);
      }
    },
    clearHistory() {
      // 使用 splice 方法清空数组
      this.historyStack.splice(0, this.historyStack.length);
    },
  },
});