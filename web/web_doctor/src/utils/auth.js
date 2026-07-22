// src/utils/auth.js

// 获取当前医生ID
export function getCurrentDoctorId() {
  return localStorage.getItem("doctorId") || "default-doctor-id";
}

// 设置医生ID
export function setCurrentDoctorId(doctorId) {
  localStorage.setItem("doctorId", doctorId);
}

// 检查登录状态
export function isAuthenticated() {
  return !!localStorage.getItem("doctorId");
}
