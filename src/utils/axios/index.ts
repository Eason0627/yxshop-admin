// 引入 axios
import axios from "axios";

// 初始化基础配置
const instance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 携带 token
    const token = localStorage.getItem("token") || null;
    if (token) {
      config.headers.Authorization = token;
    }
    // 检查是否为文件上传请求
    if (config.headers['Content-Type'] === 'multipart/form-data') {
      console.log(config.headers['Content-Type'])
      // 对于文件上传请求，保持原有的 Content-Type
      return config;
    } else {
      // 对于非文件上传请求，可以在这里修改 Content-Type
      console.log(config.headers['Content-Type'])
      config.headers['Content-Type'] = 'application/json'; // 示例：对于非文件上传请求
      return config;
    }
  },
  (error) => {
    // 请求失败
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 响应成功
    return response;
  },
  (error) => {
    // 响应失败
    return Promise.reject(error);
  }
);

export default instance;
