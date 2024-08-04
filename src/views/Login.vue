<template>
  <div
    class="login w-full h-full flex items-center justify-center light:bg-white dark:bg-black"
  >
    <div
      class="form-container relative w-full h-[30rem] flex flex-col justify-center max-w-md"
    >
      <form
        v-if="form_type === 'login'"
        key="login"
        class="login-form absolute w-5/6 left-10 p-8 border-2 border-solid border-slate-100 bg-white shadow-xl rounded-lg"
      >
        <h2 class="mb-4 text-2xl font-semibold">壹心_SHOP</h2>
        <hr />
        <br />
        <div class="mb-4 flex flex-row items-center">
          <label for="email" class="block text-sm mr-auto">邮箱:</label>
          <input
            type="email"
            id="email"
            v-model="loginForm.email"
            placeholder="请输入邮箱账号; xxx@qq.com"
            class="w-10/12 p-2 border rounded"
          />
        </div>
        <div class="mb-4 flex flex-row items-center">
          <label for="password" class="block text-sm mr-auto">密码:</label>
          <input
            type="password"
            id="password"
            v-model="loginForm.password"
            placeholder="请输入密码"
            class="w-10/12 p-2 border rounded"
          />
        </div>
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              v-model="rememberMe"
              class="mr-2"
            />
            <label for="remember-me" class="text-sm">记住密码</label>
          </div>
          <a
            href="#/"
            class="text-blue-500 hover:underline text-sm"
            @click="switchForm('forgetPsd')"
            >忘记密码?</a
          >
        </div>
        <div class="mb-4">
          <button
            type="submit"
            class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            @click.prevent="handleLogin"
          >
            登录
          </button>
        </div>
        <div class="mb-4">
          <button
            type="button"
            class="w-full p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            @click="switchForm('register')"
          >
            没有账号？去注册
          </button>
        </div>
      </form>
      <transition name="fade">
        <form
          v-if="form_type === 'register' || form_type === 'forgetPsd'"
          key="register"
          class="register-form absolute w-5/6 left-10 p-8 border-2 border-solid border-slate-100 bg-white shadow-lg rounded-lg"
        >
          <h2 class="mb-4 text-2xl font-semibold">
            {{ form_type === "register" ? "注册" : "忘记密码" }}
          </h2>
          <hr />
          <br />
          <div class="mb-4 flex flex-row items-center">
            <label for="register-email" class="block w-20 text-sm mr-auto"
              >邮箱:</label
            >
            <input
              type="email"
              id="register-email"
              v-model="loginForm.email"
              placeholder="请输入邮箱账号; xxx@qq.com"
              class="w-10/12 p-2 border rounded"
            />
          </div>
          <div class="mb-4 flex flex-row items-center">
            <label for="register-password" class="block w-20 text-sm mr-auto">
              {{ form_type === "register" ? "密码" : "旧密码" }}
            </label>
            <input
              type="password"
              id="register-password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              class="w-10/12 p-2 border rounded"
            />
          </div>
          <div class="mb-4 flex flex-row items-center">
            <label for="confirm-password" class="block w-20 text-sm mr-auto">{{
              form_type === "register" ? "确认密码" : "新密码"
            }}</label>
            <input
              type="password"
              id="confirm-password"
              v-model="loginForm.confirmPassword"
              placeholder="再次输入密码"
              class="w-10/12 p-2 border rounded"
            />
          </div>
          <div class="mb-4 flex flex-row items-center">
            <input
              type="text"
              id="verify-code"
              v-model="loginForm.verificationCode"
              placeholder="请输入验证码"
              class="w-8/12 px-2 py-1.5 border rounded"
            />
            <button
              class="ml-auto px-2 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              @click.prevent="sendVerificationEmail"
            >
              发送验证码
            </button>
          </div>
          <div class="mb-4">
            <button
              v-if="form_type === 'register'"
              type="button"
              class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              @click="handleRegister"
            >
              注册
            </button>
            <button
              v-else
              type="button"
              class="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              @click="handleForgetPsd"
            >
              忘记密码
            </button>
          </div>
          <button
            type="button"
            class="w-full p-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            @click="switchForm('login')"
          >
            取消
          </button>
        </form>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Axios, AxiosResponse } from "axios";
import { reactive, ref, inject, onMounted, watch } from "vue";
import { PopUp, Type } from "@/components/PopUp/index";
import { useRouter } from "vue-router";
// 导入记住密码状态仓库
import { useRememberMeStore } from "@/store/index";
import User from "@/model/User";
const store = useRememberMeStore();

// 获取 router 对象
const router = useRouter();

// 表单类型
const form_type = ref("login");

// 表单数据
const loginForm = reactive({
  email: "",
  password: "",
  confirmPassword: "",
  verificationCode: "",
});

// 记住密码
const rememberMe = ref(false);

// 获取 axios
const axios: Axios = inject("axios") as Axios;
let res: AxiosResponse;

// 切换表单
const switchForm = (form: "login" | "register" | "forgetPsd") => {
  form_type.value = form;
  loginForm.email = "";
  loginForm.password = "";
  loginForm.confirmPassword = "";
  loginForm.verificationCode = "";
};

const handleLogin = async () => {
  if (res) return PopUp.getInstance(Type.alert, "操作频繁！").show();
  // 校验表单数据
  if (loginForm.email === "") {
    return PopUp.getInstance(Type.error, "邮箱不能为空").show();
  }
  if (loginForm.password === "") {
    return PopUp.getInstance(Type.error, "密码不能为空").show();
  }
  // 如果已经登录，则提示
  if (localStorage.getItem("token")) {
    // 跳转首页
    router.push("/home");
    return PopUp.getInstance(Type.alert, "已经登录，请勿重复登录").show();
  }
  res = (await axios
    .post("/login", {
      username: loginForm.email,
      email: loginForm.email,
      password: loginForm.password,
    })
    .then((res: AxiosResponse) => {
      if (res.data.code === 200) {
        PopUp.getInstance(Type.success, "登录成功").show();
        const user: User = res.data.data.user;
        const token: string = res.data.data.token
        // 存储token
        localStorage.setItem("token", token);
        // 存储当前登录用户信息
        localStorage.setItem("user", JSON.stringify(user));
        // 导入 router 跳转首页
        router.push("/home");
      } else {
        PopUp.getInstance(Type.error, res.data.msg).show();
      }
    })) as AxiosResponse;

  // 记住密码勾选后的逻辑
  if (rememberMe.value) {
    // 存储用户名
    localStorage.setItem("email", loginForm.email);
    // 存储密码
    localStorage.setItem("password", loginForm.password);
  }
};

const handleRegister = async () => {
  // 防止重复发起请求
  if (res) return PopUp.getInstance(Type.alert, "操作频繁！").show();
  // 校验数据
  if (loginForm.password === "") {
    return PopUp.getInstance(Type.error, "密码不能为空").show();
  }
  if (loginForm.password !== loginForm.confirmPassword) {
    return PopUp.getInstance(Type.error, "两次输入的密码不一致").show();
  }
  if (loginForm.verificationCode === "") {
    return PopUp.getInstance(Type.error, "验证码不能为空").show();
  }
  res = (await axios
    .post("/register", {
      username: loginForm.email,
      email: loginForm.email,
      password: loginForm.password,
      code: loginForm.verificationCode,
    })
    .then((res: AxiosResponse) => {
      if (res.data.code === 200) {
        PopUp.getInstance(Type.success, "注册成功").show();
        // 跳转登录
        switchForm("login");
        // 清空数据
        loginForm.email = "";
        loginForm.password = "";
        loginForm.confirmPassword = "";
        loginForm.verificationCode = "";
      } else {
        PopUp.getInstance(Type.error, res.data.msg).show();
      }
    })) as AxiosResponse;
};

// 更新密码
const handleForgetPsd = async () => {
  // 防止重复发起请求
  if (res) return PopUp.getInstance(Type.alert, "操作频繁！").show();
  // 校验数据
  if (loginForm.password === "") {
    return PopUp.getInstance(Type.error, "密码不能为空").show();
  }
  if (loginForm.password !== loginForm.confirmPassword) {
    return PopUp.getInstance(Type.error, "两次输入的密码不一致").show();
  }
  if (loginForm.verificationCode === "") {
    return PopUp.getInstance(Type.error, "验证码不能为空").show();
  }
  res = (await axios
    .post("/forgetPsd", {
      email: loginForm.email,
      oldPassword: loginForm.password,
      newPassword: loginForm.confirmPassword,
      code: loginForm.verificationCode,
    })
    .then((res: AxiosResponse) => {
      if (res.data.code === 200) {
        PopUp.getInstance(Type.success, "密码修改成功").show();
        switchForm("login");
      } else {
        PopUp.getInstance(Type.error, res.data.msg).show();
      }
    })) as AxiosResponse;
};

// 发送验证码
const sendVerificationEmail = async () => {
  // 防止重复发送验证码
  if (res) return PopUp.getInstance(Type.alert, "请勿重复发送验证码").show();
  // 校验数据
  if (loginForm.email === "") {
    return PopUp.getInstance(Type.error, "邮箱不能为空").show();
  }
  // 校验邮箱格式
  if (
    !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(loginForm.email)
  ) {
    return PopUp.getInstance(Type.error, "邮箱格式不正确").show();
  }
  res = (await axios
    .get("/sendCode", {
      params: {
        email: loginForm.email,
      },
    })
    .then((res: AxiosResponse) => {
      if (res.data.code === 200) {
        PopUp.getInstance(Type.success, "验证码发送成功").show();
      } else {
        PopUp.getInstance(Type.error, res.data.msg).show();
      }
    })) as AxiosResponse;
};

onMounted(() => {
  // 如果本地有存储数据则自动填充用户名密码
  if (localStorage.getItem("email") && localStorage.getItem("password")) {
    loginForm.email = localStorage.getItem("email") as string;
    loginForm.password = localStorage.getItem("password") as string;
    rememberMe.value = true;
  }
});

// 监听 rememberMe 数据变化
watch(
  () => rememberMe.value,
  (newValue) => {
    // 将rememberMe的值存储到store中
    store.setRememberMe(newValue);
    if (newValue) {
      // 如果勾选了记住密码，弹窗提示危险操作
      PopUp.getInstance(
        Type.confirm,
        "此操作会本地存储密码，有泄露密码风险; 非安全登录设备，请谨慎操作！",
        "记住密码警告"
      ).show();
    }
  }
);
</script>

<style scoped>
/* 用于过渡效果 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
