<template>
  <div class="topTools">
    <!-- 工具栏（缩放侧边导航，全屏显示，消息通知，用户信息，系统设置） -->
    <div class="leftBox">
      <!-- 缩放侧边导航 -->
      <div class="zoom" @click="toggleCollapse">
        <div class="fold" v-if="isCollapse">
          <el-icon :size="18"><Fold /></el-icon>
        </div>
        <div class="expand" v-else>
          <el-icon :size="18"><Expand /></el-icon>
        </div>
      </div>
      <!-- 当前路由信息 -->
      <div class="route">
        <el-dropdown trigger="click" @click="getRouteInfo()">
          <span class="el-dropdown-link">
            {{ currentRoute.name }}
            <el-icon class="el-icon--right"><arrow-down /></el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu v-if="sameRoute.length">
              <el-dropdown-item
                v-for="(item, index) in sameRoute"
                :key="index"
                @click="handleClickRoute(item)"
              >
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="rightBox">
      <!-- 搜索 -->
      <div class="search">
        <el-icon><Search /></el-icon>
      </div>
      <!-- 消息通知 -->
      <div class="notice">
        <el-icon><Bell /></el-icon>
      </div>
      <!-- 全屏显示 -->
      <div class="fullScreen" @click="">
        <el-icon><FullScreen /></el-icon>
      </div>
      <!-- 用户信息 -->
      <div class="user">
        <div class="avatar">
          <img :src="user.avatar ? user.avatar : 'https://my-oss-xiyuu.oss-cn-hangzhou.aliyuncs.com/98226638-0cfc-4a91-a88b-c410d793b2af.jpg'" alt="用户头像" />
        </div>
        <div class="username">
          {{ user.username }}
        </div>
      </div>
      <!-- 系统设置 -->
      <!-- <div class="setting">
        <el-icon><Setting /></el-icon>
      </div> -->
    </div>
  </div>
</template>
<script setup lang="ts">
/// 导入事件总线
import bus from "@/utils/event-bus.ts";
import { ref, onBeforeMount, onMounted } from "vue";
import { RouteRecordRaw, useRouter } from "vue-router";
import User from "@/model/User";
import { PopUp, Type } from "../PopUp";

// 记录侧边栏缩放状态
const isCollapse = ref(true);

let user: User;
// 侧边导航展开收起
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value;
  bus.emit("zoom", isCollapse.value);
};

const router = useRouter();
let currentRoute: any = ref(router.currentRoute.value);
// 使用全局前置守卫更新路由信息
router.beforeEach((to, _from, next) => {
  // 更新当前路由引用
  currentRoute.value = to;

  // 重新获取同级路由信息
  getRouteInfo();

  // 确保导航继续
  next();
});

let sameRoute: any = ref([]);

const getRouteInfo = () => {
  // 使用 router.match 方法来获取匹配的路由记录
  const matchedRoutes = router.resolve(currentRoute.value.path).matched;

  // 找到第一个层级的匹配路由
  const firstLevelRoute = matchedRoutes[0]; // 第一个索引是根路由

  if (firstLevelRoute) {
    // 如果找到了匹配的路由，获取它的子路由
    const children = firstLevelRoute.children || [];
    children.shift();
    sameRoute.value = children;
  }
};

// 同级路由跳转
const handleClickRoute = async (route: RouteRecordRaw) => {
  await router.push(route.path);
};

const toLogin = () => {
  localStorage.clear();
  router.replace("/login");
};

onBeforeMount(() => {
  getRouteInfo();
  if (localStorage.getItem("user")) {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } else {
    PopUp.getInstance(Type.error, "请先登录").show();
    toLogin();
  }
});

onMounted(() => {});
</script>
<style lang="scss" scoped>
.topTools {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 3.125rem;
  border-left: 1px solid #eee;
  border-bottom: 1px solid #eee;
  background: #fff;
  box-sizing: border-box;
  .leftBox {
    display: flex;
    align-items: center;
    height: 100%;
    .zoom {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3.125rem;
      height: 100%;
      cursor: pointer;
      transition: background 0.3s;
      &:hover {
        background: #f6f6f6;
      }
      .fold,
      .expand {
        width: 1.25rem;
        height: 1.25rem;
      }
    }
    .route {
      display: flex;
      align-items: center;
      padding: 0 15px;
      cursor: pointer;
      span {
        height: 1.25rem;
      }
    }
  }

  .rightBox {
    display: flex;
    align-items: center;
    height: 100%;
    .search,
    .notice,
    .fullScreen,
    .user,
    .setting {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      padding: 0 10px;
      cursor: pointer;
      transition: background 0.3s;
      &:hover {
        background: #f6f6f6;
      }
    }
    .user {
      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #f6f6f6;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      .username {
        width: 100px;
        font-size: 12px;
        font-weight: 700;
        text-align: center;
        text-overflow: ellipsis;
        // 禁止文字换行
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
}
</style>
