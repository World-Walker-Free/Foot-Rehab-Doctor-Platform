// main.js
import { createApp } from "vue";
import App from "./App.vue";
import Chart from "chart.js/auto";
import router from "./router";
import { ElNotification } from "element-plus";
import { getCurrentDoctorId } from "@/utils/auth";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App);

// 注册 Element Plus
app.use(ElementPlus);

// 注册图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.use(router);

// 确保只在客户端运行
if (typeof window !== "undefined") {
  app.mount("#app");

  // // 延迟初始化 WebSocket，确保路由系统已准备就绪
  // setTimeout(() => {
  //   const doctorId = getCurrentDoctorId()

  //   if (doctorId) {
  //     // 使用安全的 WebSocket URL
  //     const socketUrl = window.location.protocol === 'https:'
  //       ? `wss://${window.location.host}/ws?doctorId=${doctorId}`
  //       : `ws://${window.location.host}/ws?doctorId=${doctorId}`

  //     const socket = new WebSocket(socketUrl)

  //     socket.addEventListener('open', () => {
  //       console.log('WebSocket connected')
  //     })

  //     socket.addEventListener('error', (error) => {
  //       console.error('WebSocket error:', error)
  //     })

  //     socket.addEventListener('message', (event) => {
  //       try {
  //         const alertData = JSON.parse(event.data)

  //         ElNotification({
  //           title: `患者报警：${alertData.patientName}`,
  //           message: `【${alertData.metric}】触发报警：${alertData.currentValue}`,
  //           duration: 0,
  //           type: 'error',
  //           onClick: () => {
  //             // 使用路由实例导航
  //             router.push(`/patient/${alertData.patientId}`)
  //           }
  //         })
  //       } catch (e) {
  //         console.error('Failed to parse WebSocket message:', e)
  //       }
  //     })
  //   }
  // }, 1000) // 延迟1秒确保路由系统初始化完成
}
