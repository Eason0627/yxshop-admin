import { ComponentInternalInstance, createApp } from "vue";

import { PopUp, Type } from "@/components/PopUp/index";
import "./style/style.css";
import "./style/dialog.css";
import "./style/popup.css";
import "./style/tailwind.css";

import App from "./App.vue";
const app = createApp(App);

// 导入默认图片
import defaultAvatar from "@/assets/6c5aad05a990b987ef542ef3db57147.jpg"; // 头像
import defaultShopImage from "@/assets/shop.jpg";
app.provide("defaultAvatar", defaultAvatar);
app.provide("defaultShopImage", defaultShopImage);


// 导入 vue-router
import router from "./router";

// 导入 pinia
import { createPinia, setActivePinia } from "pinia";
const pinia = createPinia();
setActivePinia(pinia); // 手动激活 Pinia，对于非组件环境特别重要

// 导入 axios
import instance from "./utils/axios/index";
app.provide("axios", instance);

// 导入 Echarts
import * as echarts from "echarts";
app.provide("echarts", echarts);

// ElementPlus 组件库相关
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import zhCn from "element-plus/es/locale/lang/zh-cn";
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.config.errorHandler = (
  err: Error | any,
  instance: ComponentInternalInstance | null,
  info: string
) => {
  console.error("Global error handler:", err, info);
  if (err.name == "AxiosError") {
    switch (err.message) {
      case "Network Error":
        PopUp.getInstance(Type.error, "网络错误，请检查网络连接").show();
        break;
      case "timeout of 5000ms exceeded":
        PopUp.getInstance(Type.error, "请求超时，请重试").show();
        break;
      default:
        PopUp.getInstance(Type.error, err).show();
    }
  }
};

app
  .use(router)
  .use(pinia)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount("#app");
