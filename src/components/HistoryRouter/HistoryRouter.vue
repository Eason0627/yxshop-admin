<template>
  <div class="historicalRouter">
    <div class="routerList">
      <div
        class="item"
        :class="{ active: item.fullPath == router.currentRoute.value.fullPath }"
        v-for="(item, index) in historyStack"
        :key="index"
        @click="goTo(item.fullPath)"
      >
        <span>{{ item.name }}</span>
        <span
          class="close"
          :style="{
            opacity:
              item.fullPath == router.currentRoute.value.fullPath ? 1 : 0,
          }"
          v-if="index !== 0"
          @click="closeHistory(item)"
        >
          <el-icon><Close /></el-icon>
        </span>
      </div>
    </div>
    <div class="action">
      <div class="refresh" @click="refresh()">
        <el-icon><Refresh /></el-icon>
      </div>
      <div class="showTabs" @click="logHistory">
        <el-icon><ArrowDown /></el-icon>
      </div>
      <div class="fullScreen">
        <el-icon><FullScreen /></el-icon>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouteLocationNormalized, useRouter } from "vue-router";
import { useRouterHistoryStore } from "@/store/index";

const router = useRouter();
const routeHistory = useRouterHistoryStore();

// 从 Store 中获取历史栈
const historyStack = routeHistory.historyStack;

// 方法：导航到指定的历史记录
const goTo = (path: string) => {
  if (router.currentRoute.value.fullPath == path) return;
  router.push(path);
};

// 清除历史记录关闭标签页，如果为当前激活路由返回上一级
const closeHistory = (_router: RouteLocationNormalized) => {
  if (_router.fullPath == router.currentRoute.value.fullPath) {
    router.go(-1);
  }
  routeHistory.removeHistory(_router);
};

// 方法：用于调试，打印历史记录
const logHistory = () => {
  console.log("当前历史记录:", historyStack);
};

// 刷新当前路由
const refresh = () => {
  router.go(0);
};

onMounted(() => {
  routeHistory.clearHistory();
  // 获取当前路由对象，添加进路由历史记录
  routeHistory.pushToHistory(router.currentRoute.value);
});
</script>

<style lang="scss" scoped>
.historicalRouter {
  display: flex;
  justify-content: space-between;
  height: 35px;
  font-size: 12px;
  border-bottom: 1px solid var(--boxShadow-color);
  background: #fff;
  box-sizing: border-box;
  .routerList {
    display: flex;
    align-items: center;
    padding: 0 5px;
    margin-top: 5px;
    .item {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 30px;
      padding: 0 10px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      border: 1px solid var(--boxShadow-color);
      text-align: center;
      cursor: pointer;
      box-sizing: border-box;
      .close {
        position: absolute;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        padding-right: 5px;
        transition: all 0.3s;
        opacity: 0;
      }
      &:hover {
        color: var(--theme-color);
        .close {
          opacity: 1 !important;
        }
      }
    }
    .item:not(:first-child) {
      padding-right: 20px;
      margin: 0 5px;
    }

    .item.active {
      color: #fff !important;
      background: var(--theme-color) !important;
    }
  }
  .action {
    display: flex;
    align-items: center;
    .refresh,
    .showTabs,
    .fullScreen {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 35px;
      height: 100%;
      border-left: 1px solid #eee;
      font-size: 16px;
      color: #8b949e;
      cursor: pointer;
      transition: all 0.3s;
      &:hover {
        color: #262626;
      }
    }
  }
}
</style>
