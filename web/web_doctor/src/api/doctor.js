// src/api/doctor.js
import axios from "axios";

// API 基础地址
const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://cloud1-0gkrmbmj8a3a8eb4-1380573880.ap-shanghai.app.tcloudbase.com/doctor/api"
    : "/api";

// 创建 axios 实例
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 医生登录
export const doctorLogin = (account, password) => {
  return api.post("/auth/login", { account, password });
};

// 医生注册
export const doctorRegister = (name, account, password) => {
  return api.post("/auth/register", {
    name,
    account, // account 可以是手机号或邮箱
    password,
  });
};

// 获取当前医生信息
export const getDoctorInfo = () => {
  const token = localStorage.getItem("token");
  return api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 医生登出
export const doctorLogout = () => {
  return api.post("/auth/logout");
};

export { api };
