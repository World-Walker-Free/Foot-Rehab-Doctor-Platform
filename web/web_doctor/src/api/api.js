// src/api/api.js
import axios from "axios";
import Chart from "chart.js/auto";

const apiClient = axios.create({
  baseURL: "/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 报警规则API
export const getAlertRules = (patientId) => {
  return apiClient.get(`/alerts/rules/${patientId}`);
};

export const getAlertHistory = (patientId) => {
  return apiClient.get(`/alerts/history/${patientId}`);
};

export const saveAlertRule = (ruleData, ruleId = null) => {
  if (ruleId) {
    return apiClient.put(`/alerts/rules/${ruleId}`, ruleData);
  }
  return apiClient.post("/alerts/rules", ruleData);
};

export const deleteAlertRule = (ruleId) => {
  return apiClient.delete(`/alerts/rules/${ruleId}`);
};
