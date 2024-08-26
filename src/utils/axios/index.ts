// 引入 axios
import axios from "axios";

// 初始化基础配置
const instance = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 携带 token
    const token = localStorage.getItem("token") || null;
    if (token) {
      config.headers.Authorization = "Bearer " + token;
    }
    // 检查是否为文件上传请求
    if (config.headers["Content-Type"] === "multipart/form-data") {
      // 对于文件上传请求，保持原有的 Content-Type
      return config;
    } else {
      // 对于非文件上传请求，可以在这里修改 Content-Type
      config.headers["Content-Type"] = "application/json"; // 示例：对于非文件上传请求
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
    // console.log(response)
    return response;
  },
  (error) => {
    // 响应失败
    // 根据HTTP状态码处理错误
    const errorData = {
      code: 0,
      message: "",
    };
    if (error.response) {
      switch (error.response.status) {
        case 400:
          // 客户端错误，如表单验证未通过
          errorData.code = 400;
          errorData.message = "表单信息填写错误";
          break;
        case 401:
          // 未授权，可以在这里处理 token 失效的情况
          // 如重新获取 token 并尝试重新发送请求
          errorData.code = 401;
          errorData.message = "用户未登录或登录参数已过期";
          break;
        case 403:
          // 禁止访问
          break;
        case 404:
          // 资源不存在
          break;
        case 500:
          // 服务器内部错误
          errorData.code = 500;
          errorData.message = "服务器内部错误，请联系网站管理员";
          break;
        default:
          // 其他错误
          errorData.code = 500;
          errorData.message = error.message;
          break;
      }
    }
    if (error.response && error.response.data) {
      // 如果响应体有错误信息，则使用响应体中的错误信息
      errorData.message = error.response.data.message;
    }
    if (error.message === "Network Error") {
      // 网络错误
      errorData.code = 500;
      errorData.message = "网络错误，请检查网络连接";
    }

    // 可以选择在此处记录错误日志或显示给用户
    console.error("Axios Error:", error.message);

    // 可以返回一个自定义错误信息或直接返回原始错误对象
    return Promise.reject(errorData);
  }
);

export default instance;
