// src/api/auth.js
import { api, login } from "@/api/patients"; // 导入api实例和登录函数

// 如果需要在auth.js中定义额外的认证函数
export const logout = () => api.post("/auth/logout");
export const getCurrentUser = () => api.get("/auth/me");

export { login };
src / api / auth.js;
