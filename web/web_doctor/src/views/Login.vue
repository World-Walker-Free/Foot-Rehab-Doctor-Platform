<template>
  <div class="login-page-root">
    <!-- 背景装饰 -->
    <div class="bg-decoration">
      <div class="bg-circle circle-1"></div>
      <div class="bg-circle circle-2"></div>
      <div class="bg-circle circle-3"></div>
    </div>

    <!-- 标题区域 -->
    <div class="login-branding">
      <div class="brand-icon">
        <i class="bi bi-hospital"></i>
      </div>
      <h2>足部康复训练管理系统</h2>
      <p>医生端</p>
    </div>

    <div
      class="container"
      :class="{ 'right-panel-active': isRightPanelActive }"
    >
      <!-- 注册面板 -->
      <div class="form-container sign-up-container">
        <form @submit.prevent="handleRegister">
          <h1>注册账号</h1>
          <div class="input-group">
            <i class="bi bi-person input-icon"></i>
            <input type="text" placeholder="姓名" v-model="registerForm.name" />
          </div>
          <div class="input-group">
            <i class="bi bi-envelope input-icon"></i>
            <input
              type="text"
              placeholder="账号名/邮箱/手机号"
              v-model="registerForm.account"
            />
          </div>
          <div class="input-group">
            <i class="bi bi-lock input-icon"></i>
            <input
              type="password"
              placeholder="密码"
              v-model="registerForm.password"
            />
          </div>
          <button class="submit-btn" :disabled="registerLoading">
            <span v-if="registerLoading" class="btn-spinner"></span>
            {{ registerLoading ? "注册中..." : "注册" }}
          </button>
        </form>
      </div>

      <!-- 登录面板 -->
      <div class="form-container sign-in-container">
        <form @submit.prevent="handleLogin">
          <h1>欢迎登录</h1>
          <div class="input-group">
            <i class="bi bi-person input-icon"></i>
            <input
              type="text"
              placeholder="账号名/邮箱/手机号"
              v-model="loginForm.account"
            />
          </div>
          <div class="input-group">
            <i class="bi bi-lock input-icon"></i>
            <input
              type="password"
              placeholder="密码"
              v-model="loginForm.password"
            />
          </div>
          <button class="submit-btn" :disabled="loginLoading">
            <span v-if="loginLoading" class="btn-spinner"></span>
            {{ loginLoading ? "登录中..." : "登录" }}
          </button>
        </form>
      </div>

      <!-- 渐变面板 -->
      <div class="overlay-container">
        <div class="overlay">
          <div class="overlay-panel overlay-left">
            <div class="overlay-icon">
              <i class="bi bi-box-arrow-in-right"></i>
            </div>
            <h1>欢迎回来!</h1>
            <p>已有账号？返回登录</p>
            <button class="ghost" @click="togglePanel(false)">登录</button>
          </div>
          <div class="overlay-panel overlay-right">
            <div class="overlay-icon">
              <i class="bi bi-person-plus"></i>
            </div>
            <h1>你好!</h1>
            <p>很高兴您能加入我们！<br />让我们一起开始吧。</p>
            <button class="ghost" @click="togglePanel(true)">注册</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部信息 -->
    <!-- <div class="login-footer">
      <p>足部康复训练管理系统 v1.0</p>
    </div> -->
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { doctorLogin, doctorRegister } from "@/api/doctor";

const router = useRouter();

const loginForm = ref({ account: "", password: "" });
const registerForm = ref({ name: "", account: "", password: "" });
const loginLoading = ref(false);
const registerLoading = ref(false);
const isRightPanelActive = ref(false);

const togglePanel = (isActive) => {
  isRightPanelActive.value = isActive;
};

const handleLogin = async () => {
  if (!loginForm.value.account.trim()) {
    ElMessage.warning("请输入账号/手机号/邮箱");
    return;
  }
  if (!loginForm.value.password) {
    ElMessage.warning("请输入密码");
    return;
  }

  loginLoading.value = true;

  try {
    const response = await doctorLogin(
      loginForm.value.account,
      loginForm.value.password,
    );

    if (response.data.success) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      ElMessage.success("登录成功");
      router.push({ name: "Welcome" });
    } else {
      ElMessage.error(response.data.error || "登录失败");
    }
  } catch (error) {
    console.error("登录错误:", error);
    const errorMsg = error.response?.data?.error || "登录失败，请检查网络连接";
    ElMessage.error(errorMsg);
  } finally {
    loginLoading.value = false;
  }
};

const handleRegister = async () => {
  if (!registerForm.value.name.trim()) {
    ElMessage.warning("请输入姓名");
    return;
  }
  if (!registerForm.value.account.trim()) {
    ElMessage.warning("请输入邮箱或手机号");
    return;
  }
  if (!registerForm.value.password) {
    ElMessage.warning("请输入密码");
    return;
  }
  if (registerForm.value.password.length < 6) {
    ElMessage.warning("密码长度不能少于6位");
    return;
  }

  registerLoading.value = true;

  try {
    const response = await doctorRegister(
      registerForm.value.name,
      registerForm.value.account,
      registerForm.value.password,
    );

    if (response.data.success) {
      ElMessage.success("注册成功！请登录");
      registerForm.value = { name: "", account: "", password: "" };
      isRightPanelActive.value = false;
    } else {
      ElMessage.error(response.data.error || "注册失败");
    }
  } catch (error) {
    console.error("注册错误:", error);
    const errorMsg = error.response?.data?.error || "注册失败，请稍后重试";
    ElMessage.error(errorMsg);
  } finally {
    registerLoading.value = false;
  }
};

if (
  localStorage.getItem("isLoggedIn") === "true" &&
  localStorage.getItem("token")
) {
  router.push({ name: "Welcome" });
}
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Montserrat:400,600,800");

@keyframes show {
  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }
  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}
</style>

<style scoped>
.login-page-root {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #e8f4f8 0%, #d1e8f0 50%, #e0f0f5 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-family: "Montserrat", sans-serif;
  margin: 0;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
}

.login-page-root * {
  box-sizing: border-box;
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
}

.bg-circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.circle-1 {
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  top: -200px;
  right: -200px;
  animation: floatCircle 20s ease-in-out infinite;
  opacity: 0.15;
}

.circle-2 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  bottom: -100px;
  left: -100px;
  animation: floatCircle 15s ease-in-out infinite reverse;
  opacity: 0.12;
}

.circle-3 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: floatCircle 25s ease-in-out infinite;
  opacity: 0.08;
}

@keyframes floatCircle {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -30px) scale(1.05);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.95);
  }
}

/* 品牌区域 */
.login-branding {
  text-align: center;
  margin-bottom: 2rem;
  animation: fadeInDown 0.8s ease;
}

.brand-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 32px;
  color: white;
  box-shadow: 0 10px 30px rgba(24, 188, 156, 0.4);
}

.login-branding h2 {
  color: #1e293b;
  font-size: 1.6rem;
  font-weight: 700;
  margin: 0 0 0.3rem;
  letter-spacing: 1px;
}

.login-branding p {
  color: #64748b;
  font-size: 0.9rem;
  margin: 0;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 主容器 */
.login-page-root .container {
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
  position: relative;
  overflow: hidden;
  width: 800px;
  max-width: 95%;
  min-height: 480px;
  animation: containerEntry 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes containerEntry {
  from {
    opacity: 0;
    transform: scale(0.85) translateY(30px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 表单容器 */
.login-page-root .form-container {
  position: absolute;
  top: 0;
  height: 100%;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-page-root .sign-in-container {
  left: 0;
  width: 50%;
  z-index: 2;
}

.login-page-root .container.right-panel-active .sign-in-container {
  transform: translateX(100%);
}

.login-page-root .sign-up-container {
  left: 0;
  width: 50%;
  opacity: 0;
  z-index: 1;
}

.login-page-root .container.right-panel-active .sign-up-container {
  transform: translateX(100%);
  opacity: 1;
  z-index: 5;
  animation: show 0.6s;
}

.login-page-root form {
  background-color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  height: 100%;
  text-align: center;
}

.login-page-root form h1 {
  font-weight: 700;
  margin: 0 0 1.5rem;
  color: #1e293b;
  font-size: 1.8rem;
}

/* 输入框组 */
.input-group {
  position: relative;
  width: 100%;
  margin-bottom: 1rem;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 16px;
  transition: color 0.3s ease;
}

.input-group:focus-within .input-icon {
  color: #18bc9c;
}

.login-page-root input {
  background-color: #f1f5f9;
  border: 2px solid transparent;
  padding: 14px 14px 14px 42px;
  width: 100%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 10px;
  font-size: 14px;
}

.login-page-root input:focus {
  background-color: #fff;
  border-color: #18bc9c;
  outline: none;
  box-shadow: 0 0 0 4px rgba(24, 188, 156, 0.15);
}

.login-page-root input::placeholder {
  color: #94a3b8;
}

/* 按钮 */
.submit-btn {
  width: 100%;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  color: white;
  font-size: 14px;
  font-weight: 600;
  padding: 14px;
  margin-top: 0.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(24, 188, 156, 0.4);
}

.submit-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 覆盖面板 */
.login-page-root .overlay-container {
  position: absolute;
  top: 0;
  left: 50%;
  width: 50%;
  height: 100%;
  overflow: hidden;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 100;
}

.login-page-root .container.right-panel-active .overlay-container {
  transform: translateX(-100%);
}

.login-page-root .overlay {
  background: linear-gradient(135deg, #18bc9c 0%, #0d9488 50%, #0f766e 100%);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 0 0;
  color: #ffffff;
  position: relative;
  left: -100%;
  height: 100%;
  width: 200%;
  transform: translateX(0);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.login-page-root .container.right-panel-active .overlay {
  transform: translateX(50%);
}

.login-page-root .overlay-panel {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 40px;
  text-align: center;
  top: 0;
  height: 100%;
  width: 50%;
  transform: translateX(0);
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.overlay-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  margin-bottom: 1.2rem;
}

.login-page-root .overlay-left {
  transform: translateX(-20%);
}

.login-page-root .container.right-panel-active .overlay-left {
  transform: translateX(0);
}

.login-page-root .overlay-right {
  right: 0;
  transform: translateX(0);
}

.login-page-root .container.right-panel-active .overlay-right {
  transform: translateX(20%);
}

.login-page-root .overlay-panel h1 {
  font-size: 1.8rem;
  margin: 0 0 0.8rem;
  font-weight: 700;
}

.login-page-root .overlay-panel p {
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0.5px;
  margin: 0 0 2rem;
  opacity: 0.9;
}

.login-page-root button.ghost {
  background-color: transparent;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  padding: 12px 40px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
}

.login-page-root button.ghost:hover {
  background-color: rgba(255, 255, 255, 0.2);
  border-color: white;
  transform: translateY(-2px);
}

/* 底部信息 */
.login-footer {
  position: absolute;
  bottom: 20px;
  text-align: center;
}

.login-footer p {
  color: #94a3b8;
  font-size: 12px;
  margin: 0;
}
</style>
