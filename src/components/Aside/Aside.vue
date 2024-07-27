<template>
  <div class="aside w-[210px] h-full bg-[#1a2221] transition-width duration-300" ref="aside">
    <div class="logo px-5 py-2 flex items-center text-white">
      <div class="img w-10 h-10 mr-3 rounded-full overflow-hidden">
        <img src="../../assets/logo.png" alt="logo" />
      </div>
      <div class="text font-['ZhanKuKuHei'] text-xl leading-[3rem]">
        壹心_SHOP
      </div>
    </div>
    <div class="menu relative w-full h-full overflow-y-auto">
      <div class="menuGroup" v-for="item in navigation">
        <div
          class="menuItem flex items-center h-14 px-5 text-gray-400 transition-all duration-300 cursor-pointer hover:text-white"
          :class="item.expand ? 'text-white' : ''"
          @click="navigationTo(item, $event)"
        >
          <div class="left-icon" v-if="item.left_icon">
            <i class="iconfont text-xl" v-html="item.left_icon"></i>
          </div>
          <div class="text flex-1 pl-3 text-left text-sm">
            {{ item.name }}
          </div>
          <div
            class="right-icon text-xl transition-transform duration-300"
            v-if="item.right_icon && item.children && item.children.length > 0"
          >
            <i class="iconfont" v-html="item.right_icon"></i>
          </div>
        </div>
        <Transition>
          <div class="child w-full bg-[#212b29]" v-show="item.expand">
            <div
              class="childGroup"
              v-if="item.children && item.children.length > 0"
              v-for="child in item.children"
            >
              <div
                class="childItem flex items-center h-12 px-5 text-gray-400 transition-all duration-300 hover:text-white cursor-pointer"
                :class="
                  child.active
                    ? 'text-white bg-[#197c68]'
                    : child.expand
                    ? 'text-white'
                    : ''
                "
                @click="navigationTo(child, $event)"
              >
                <div class="left-icon" v-if="child.left_icon">
                  <i class="iconfont text-xl" v-html="child.left_icon"></i>
                </div>
                <div class="text flex-1 pl-8 text-left text-sm">
                  {{ child.name }}
                </div>
                <div
                  class="right-icon text-xl transition-transform duration-300"
                  v-if="
                    child.right_icon &&
                    child.children &&
                    child.children.length > 0
                  "
                >
                  <i class="iconfont" v-html="child.right_icon"></i>
                </div>
              </div>
              <Transition>
                <div class="childList" v-show="child.expand">
                  <div
                    class="childGroup"
                    v-if="child.children && child.children.length > 0"
                    v-for="current in child.children"
                  >
                    <div
                      class="childItem flex items-center h-12 px-5 text-gray-400 transition-all duration-300 hover:text-white cursor-pointer"
                      :class="current.active ? 'text-white bg-[#197c68]' : ''"
                      @click="navigationTo(current, $event)"
                    >
                      <div class="left-icon" v-if="current.left_icon">
                        <i
                          class="iconfont text-xl"
                          v-html="current.left_icon"
                        ></i>
                      </div>
                      <div class="text flex-1 pl-14 text-left text-sm">
                        {{ current.name }}
                      </div>
                      <div
                        class="right-icon text-xl transition-transform duration-300"
                        v-if="
                          current.right_icon &&
                          current.children &&
                          current.children.length > 0
                        "
                      >
                        <i class="iconfont" v-html="current.right_icon"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </Transition>
            </div>
          </div>
        </Transition>
      </div>
      <!-- 更多菜单项 -->
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { NavigationItem } from "./Aside.interface";
import emitter from "@/utils/event-bus.ts";

const router = useRouter();
// props 接收父组件数据
const props = defineProps(["navigation"]);

// 路由数组
const navigation: NavigationItem[] = reactive(props.navigation);

// 侧边导航dom
const aside = ref<HTMLElement | null>(null);
const navigationTo = async (item: any, event: Event) => {
  // 获取当前点击dom对象
  const target = event.currentTarget as HTMLElement;

  if (item.children && item.children.length) {
    // 有子元素则箭头旋转
    const right_icon = target.querySelector(".right-icon") as HTMLElement;

    if (right_icon) {
      if (item.expand) {
        right_icon.style.transform = "rotate(180deg)";
      } else {
        right_icon.style.transform = "rotate(0deg)";
      }
    }
  }
  await router.push(item.url);
  // 当前 item 含有 expand 属性则取反
  if (item.hasOwnProperty("expand")) {
    item.expand = !item.expand;
  }
  // 当前激活的 active 改成 true, 其余为false
  setActive(navigation);
};

const setActive = (array: any) => {
  array.forEach((item: any) => {
    if (item.children && item.children.length) {
      setActive(item.children);
    } else {
      item.active = false;
      if (item.url === router.currentRoute.value.path) {
        item.active = true;
      }
    }
  });
};

const handleNavigation = (array: any[]) => {
  array.forEach((item: any) => {
    if (item.children && item.children.length) {
      // 如果当前的路由地址包含 item.url 则设置 expand 为 true
      if (router.currentRoute.value.path.includes(item.url)) {
        item.expand = true;
      } else {
        item.expand = false;
      }
      handleNavigation(item.children);
    } else {
      // 如果当前的路由地址等于 item.url 则设置 active 为 true
      if (router.currentRoute.value.path === item.url) {
        item.active = true;
      } else {
        item.active = false;
      }
    }
  });
};

onMounted(() => {
  // 处理导航数组 遍历递归
  // 将含有 children 属性的元素 添加 expand 属性
  // 没有 children 属性的元素 添加 active 属性
  handleNavigation(navigation);

  // 监听自定义事件
  // 侧边导航的缩放与收起
  emitter.on("zoom", (isCollapse: boolean) => {
    if (!aside || !aside.value) return;
    if (!isCollapse) {
      aside.value.style.opacity = "0";
      aside.value.style.transform = "translateX(-210px)";
      aside.value.style.width = "0";
    } else {
      aside.value.style.opacity = "1";
      aside.value.style.transform = "translateX(0)";
      aside.value.style.width = "210px";
    }
  });
});

onUnmounted(() => {
  // 解绑事件以避免内存泄漏
  emitter.off("zoom");
});
</script>
<style lang="scss" scoped>
.aside {
  .menu {
    padding-bottom: 100px;
    overflow-y: auto;
    // 整体样式
    &::-webkit-scrollbar {
      width: 0.375rem;
      height: 0.0625rem;
      transition: all 0.4s;
    }

    // 内滚动条
    &::-webkit-scrollbar-thumb {
      background-color: #12a89d;
      border-radius: 0.3125rem;
      &:hover {
        cursor: pointer;
        background-color: #30e3ca;
      }
    }

    // 滚动条轨道
    &::-webkit-scrollbar-track {
      background-color: #40514e;
      border-radius: 0.625rem;
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: all 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(500px);
}
</style>
