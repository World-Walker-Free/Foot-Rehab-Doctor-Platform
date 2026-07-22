// web/web_doctor/src/api/patients.js
import axios from "axios";

// 根据环境变量判断使用哪个地址
const isProduction = import.meta.env.MODE === "production";
const API_BASE_URL = isProduction
  ? "https://cloud1-0gkrmbmj8a3a8eb4-1380573880.ap-shanghai.app.tcloudbase.com/doctor/api"
  : "/api"; // 开发环境使用 Vite 代理

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器（添加日志）
api.interceptors.request.use(
  (config) => {
    console.log(`[API Request] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  },
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log(`[API Response] ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error(
      "[API Response Error]",
      error.response?.data || error.message,
    );
    return Promise.reject(error);
  },
);

// ============ 患者基础操作 ============

// 获取患者列表
export const getPatients = () => {
  return api.get("/patients");
};

// 添加患者
export const addPatient = (data) => {
  return api.post("/patients", data);
};

// 更新患者
export const updatePatient = (id, data) => {
  return api.put(`/patients/${id}`, data);
};

// 删除患者
export const deletePatient = (id) => {
  return api.delete(`/patients/${id}`);
};

// 获取单个患者
export const getPatientById = (id) => {
  return api.get(`/patients/${id}`);
};

// 健康检查
export const healthCheck = () => {
  return api.get("/health");
};

// ============ 角度数据操作（新增） ============

// 更新患者角度数据（训练角度和次数）
export const updatePatientAngles = (id, data) => {
  return api.put(`/patients/${id}/angles`, data);
};

// 获取患者角度数据
export const getPatientAngles = (id) => {
  return api.get(`/patients/${id}/angles`);
};

export { api };
