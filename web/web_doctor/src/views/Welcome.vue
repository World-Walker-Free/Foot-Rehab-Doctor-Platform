<template>
  <div class="medical-platform">
    <!-- 头部 -->
    <div class="header">
      <div class="header-title">
        <svg
          class="medical-kit-icon"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 6H16V4C16 2.9 15.1 2 14 2H10C8.9 2 8 2.9 8 4V6H4C2.9 6 2 6.9 2 8V20C2 21.1 2.9 22 4 22H20C21.1 22 22 21.1 22 20V8C22 6.9 21.1 6 20 6ZM10 4H14V6H10V4ZM20 20H4V8H20V20Z"
          />
          <path d="M13 10H11V13H8V15H11V18H13V15H16V13H13V10Z" />
        </svg>
        医疗数据平台
      </div>
      <div class="user-info">
        <!-- 用户信息 -->
        <div class="user-profile">
          <div class="user-avatar">{{ userInfo.avatar }}</div>
          <div class="user-details">
            <div class="user-name">{{ userInfo.name }}</div>
            <div class="user-role">{{ userInfo.role }}</div>
          </div>
          <!-- 退出登录图标 -->
          <div class="logout-icon" @click="logout" title="退出登录">
            <i class="bi bi-box-arrow-right"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 其余内容保持不变 -->
    <div class="main-content">
      <!-- 欢迎区域 -->
      <section class="welcome-section">
        <div class="welcome-background"></div>
        <div class="decorative-dots">
          <div
            v-for="(dot, index) in decorativeDots"
            :key="index"
            class="dot"
            :style="dot.style"
          ></div>
        </div>

        <div class="welcome-content">
          <!-- 跳动的心脏图标 -->
          <div class="heart-icon">
            <i class="bi bi-heart-pulse"></i>
          </div>

          <h1 class="welcome-title">欢迎回来，{{ userInfo.name }}！</h1>
          <p class="welcome-description">
            这里是一个专注于医疗健康数据的智能化管理平台<br />
            我们致力于提供安全、高效、智能的医疗数据解决方案
          </p>

          <div class="button-group">
            <button class="primary-button" @click="navigateToPatientManagement">
              <i class="bi bi-arrow-right-circle"></i>
              进入信息管理
            </button>
            <button class="secondary-button" @click="scrollToAbout">
              <i class="bi bi-info-circle"></i>
              了解更多
            </button>
          </div>
        </div>
      </section>

      <!-- 特性介绍区域 -->
      <section class="features-section scroll-reveal">
        <h2 class="features-title">平台核心特性</h2>
        <div class="features-grid">
          <div
            class="feature-card"
            v-for="feature in features"
            :key="feature.id"
            @mouseenter="cardHoverIn($event, feature.id)"
            @mouseleave="cardHoverOut($event, feature.id)"
          >
            <div class="feature-icon">
              <i :class="feature.icon" :id="'feature-icon-' + feature.id"></i>
            </div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">
              {{ feature.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- 了解更多页面 -->
      <section id="about" class="about-section scroll-reveal">
        <h2 class="about-title">关于医疗数据平台</h2>
        <p class="about-subtitle">
          了解我们的使命、愿景以及如何帮助医疗机构实现数字化转型
        </p>

        <div class="about-content">
          <div class="about-grid">
            <div
              class="about-card"
              v-for="item in aboutItems"
              :key="item.id"
              @mouseenter="aboutCardHoverIn($event, item.id)"
              @mouseleave="aboutCardHoverOut($event, item.id)"
            >
              <h3 class="about-card-title">
                <i :class="item.icon" :id="'about-icon-' + item.id"></i>
                {{ item.title }}
              </h3>
              <div class="about-card-content">
                <div v-if="item.id === 3 || item.id === 4">
                  <p v-for="(value, key) in item.content" :key="key">
                    <strong>{{ key }}：</strong>{{ value }}
                  </p>
                </div>
                <div v-else>
                  <p v-for="(paragraph, index) in item.content" :key="index">
                    {{ paragraph }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="contact-section">
            <h3 class="contact-title">联系我们</h3>
            <div class="contact-info">
              <div
                class="contact-item"
                v-for="contact in contactInfo"
                :key="contact.id"
              >
                <div class="contact-icon">
                  <i :class="contact.icon"></i>
                </div>
                <div class="contact-label">{{ contact.label }}</div>
                <div class="contact-value">{{ contact.value }}</div>
              </div>
            </div>

            <!-- <p style="color: #666; margin-top: 2rem">
              如果您有任何问题或需要技术支持，欢迎随时联系我们。<br />
              我们的专业团队将为您提供及时、优质的服务。
            </p> -->
          </div>

          <div class="back-to-home">
            <button
              class="primary-button"
              style="max-width: 200px"
              @click="scrollToTop"
            >
              <i class="bi bi-house-door"></i>
              返回顶部
            </button>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { getPatients } from "@/api/patients";

export default {
  name: "Welcome",
  setup() {
    const router = useRouter();
    return { router };
  },
  data() {
    return {
      userInfo: {
        name: "医生",
        role: "管理员",
        avatar: "医",
        username: "",
        email: "",
        registerTime: "",
      },
      notifications: [
        "系统维护通知：今晚23:00-01:00进行系统维护",
        "数据备份提醒：本周五将进行系统数据备份",
        "功能更新：新增患者数据分析报表功能",
      ],
      features: [
        {
          id: 1,
          icon: "bi bi-shield-check",
          title: "数据安全保障",
          description:
            "采用银行级数据加密技术，确保患者隐私安全，符合医疗数据保护标准",
        },
        {
          id: 2,
          icon: "bi bi-graph-up-arrow",
          title: "智能数据分析",
          description:
            "提供多层次数据分析功能，可视化展示患者分布趋势，辅助医疗决策",
        },
        {
          id: 3,
          icon: "bi bi-lightning-charge",
          title: "高效便捷操作",
          description:
            "简洁直观的操作界面，支持快速检索和批量处理，大幅提升工作效率",
        },
      ],
      aboutItems: [
        {
          id: 1,
          icon: "bi bi-bullseye",
          title: "我们的使命",
          content: [
            "通过技术创新，为医疗机构提供安全可靠的数字化解决方案，",
            "提升医疗服务质量，保障患者数据安全，",
            "推动医疗行业的数字化转型和智能化升级。",
          ],
        },
        {
          id: 2,
          icon: "bi bi-eye",
          title: "平台愿景",
          content: [
            "成为国内领先的医疗数据管理平台，",
            "构建覆盖全国的医疗数据服务网络，",
            "通过数据智能为医疗决策提供科学依据，",
            '最终实现"智慧医疗，健康中国"的美好愿景。',
          ],
        },
        {
          id: 3,
          icon: "bi bi-award",
          title: "核心价值",
          content: {
            安全可靠: "采用多重加密和安全认证机制",
            高效便捷: "简化操作流程，提升工作效率",
            智能分析: "提供数据洞察和决策支持",
            持续创新: "紧跟技术发展，不断优化升级",
          },
        },
        {
          id: 4,
          icon: "bi bi-gear",
          title: "技术服务",
          content: {
            数据管理: "患者信息、病历数据、医疗记录",
            分析报表: "患者统计、趋势分析、绩效评估",
            安全保障: "访问控制、数据加密、备份恢复",
            系统集成: "支持与现有医疗系统的无缝对接",
          },
        },
      ],
      contactInfo: [
        {
          id: 1,
          icon: "bi bi-telephone",
          label: "客服热线",
          value: "96166",
        },
        {
          id: 2,
          icon: "bi bi-envelope",
          label: "电子邮箱",
          value: "soc@nicu.cn",
        },
        {
          id: 3,
          icon: "bi bi-clock",
          label: "技术服务时间",
          value: "周一至周五 9:00-18:00",
        },
      ],
      decorativeDots: [],
    };
  },
  mounted() {
    this.createDecorativeDots();
    this.loadDoctorInfo();
    this.initScrollReveal();

    // 检查URL哈希
    if (window.location.hash === "#about") {
      this.$nextTick(() => {
        this.scrollToAbout();
      });
    }
  },
  methods: {
    // 加载医生信息
    async loadDoctorInfo() {
      try {
        // 先从 localStorage 获取登录信息
        const storedUser = localStorage.getItem("user");
        const storedDoctorInfo = localStorage.getItem("doctorInfo");
        const storedUserName = localStorage.getItem("userName");
        const storedCurrentUser = localStorage.getItem("currentUser");

        let doctorName = null;
        let doctorId = null;

        // 尝试从不同的存储位置获取医生信息
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser);
            doctorName = user.name || user.username || user.doctorName;
            doctorId = user.id || user.doctorId;
          } catch (e) {
            console.error("解析 user 失败:", e);
          }
        }

        if (!doctorName && storedDoctorInfo) {
          try {
            const doctorInfo = JSON.parse(storedDoctorInfo);
            doctorName = doctorInfo.name || doctorInfo.doctorName;
            doctorId = doctorInfo.id;
          } catch (e) {
            console.error("解析 doctorInfo 失败:", e);
          }
        }

        if (!doctorName && storedCurrentUser) {
          try {
            const currentUser = JSON.parse(storedCurrentUser);
            doctorName = currentUser.name || currentUser.username;
          } catch (e) {
            console.error("解析 currentUser 失败:", e);
          }
        }

        if (!doctorName && storedUserName) {
          doctorName = storedUserName;
        }

        // 如果有医生ID，尝试从数据库获取最新信息
        if (doctorId) {
          try {
            // 调用 API 获取医生信息
            const response = await getPatients(); // 注意：这里需要根据实际API调整
            // 如果您的后端有专门的医生接口，请使用对应的API
            // 这里假设可以从患者列表或医生列表中查找
            if (response.data && Array.isArray(response.data)) {
              const doctor = response.data.find(
                (d) => d.id === doctorId || d.doctor_id === doctorId,
              );
              if (doctor && doctor.name) {
                doctorName = doctor.name;
              }
            }
          } catch (error) {
            console.error("从数据库获取医生信息失败:", error);
            // 如果获取失败，继续使用 localStorage 中的名称
          }
        }

        // 设置用户信息
        if (doctorName) {
          this.userInfo.name = doctorName;
          this.userInfo.avatar = doctorName.charAt(0);
        } else {
          // 如果没有登录信息或默认是"张医生"，尝试从 localStorage 读取登录用户名
          const loginName =
            localStorage.getItem("loginName") ||
            localStorage.getItem("username") ||
            sessionStorage.getItem("username");
          if (loginName) {
            this.userInfo.name = loginName;
            this.userInfo.avatar = loginName.charAt(0);
          } else {
            // 默认显示"医生"
            this.userInfo.name = "张医生";
            this.userInfo.avatar = "医";
          }
        }

        console.log("当前登录医生:", this.userInfo.name);
      } catch (error) {
        console.error("加载医生信息失败:", error);
        // 出错时使用默认值
        this.userInfo.name = "张医生";
        this.userInfo.avatar = "医";
      }
    },

    navigateToPatientManagement() {
      this.$router.push("/information");
    },

    scrollToAbout() {
      this.$nextTick(() => {
        const aboutSection = document.getElementById("about");
        if (aboutSection) {
          aboutSection.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    },

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },

    logout() {
      if (confirm("确定要退出登录吗？")) {
        // 清除所有登录相关的存储
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("userName");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("doctorInfo");
        localStorage.removeItem("loginName");
        localStorage.removeItem("username");

        // 清除 sessionStorage
        sessionStorage.clear();

        // 跳转到登录页
        this.$router
          .replace("/login")
          .then(() => {
            console.log("已退出登录");
          })
          .catch((err) => {
            console.error("跳转失败:", err);
            window.location.href = "/#/login";
          });
      }
    },

    createDecorativeDots() {
      const dots = [];
      for (let i = 0; i < 20; i++) {
        const size = Math.random() * 15 + 5;
        const hue = 160 + Math.random() * 20;
        dots.push({
          style: {
            width: `${size}px`,
            height: `${size}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.15 + 0.05,
            backgroundColor: `hsl(${hue}, 70%, 60%)`,
          },
        });
      }
      this.decorativeDots = dots;
    },

    cardHoverIn(event, cardId) {
      const icon = document.getElementById(`feature-icon-${cardId}`);
      if (icon) {
        icon.style.transform = "scale(1.2)";
        icon.style.transition = "transform 0.3s ease";
      }
    },

    cardHoverOut(event, cardId) {
      const icon = document.getElementById(`feature-icon-${cardId}`);
      if (icon) {
        icon.style.transform = "scale(1)";
      }
    },

    aboutCardHoverIn(event, cardId) {
      const icon = document.getElementById(`about-icon-${cardId}`);
      if (icon) {
        icon.style.transform = "scale(1.2)";
        icon.style.transition = "transform 0.3s ease";
      }
    },

    aboutCardHoverOut(event, cardId) {
      const icon = document.getElementById(`about-icon-${cardId}`);
      if (icon) {
        icon.style.transform = "scale(1)";
      }
    },

    initScrollReveal() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("revealed");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
      );

      this.$nextTick(() => {
        document.querySelectorAll(".scroll-reveal").forEach((el) => {
          observer.observe(el);
        });
      });
    },
  },
};
</script>

<style scoped>
/* 样式保持不变 */
.medical-platform {
  min-height: 100vh;
  background: #f1f5f9;
  font-family: "Microsoft Yahei", sans-serif;
}

.header {
  background-color: #fff;
  padding: 0.8rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 1000;
  transition: box-shadow 0.3s ease;
  border-bottom: 1px solid #e2e8f0;
}

.header:hover {
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.1);
}

.header-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
}

.medical-kit-icon {
  width: 26px;
  height: 26px;
  fill: #18bc9c;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
  background: none;
}

.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  box-shadow: 0 2px 6px rgba(24, 188, 156, 0.2);
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.user-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 0.9rem;
}

.user-role {
  font-size: 0.75rem;
  color: #94a3b8;
}

.logout-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  color: #18bc9c;
  font-size: 1.2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-left: 0.5rem;
}

.logout-icon:hover {
  background-color: rgba(24, 188, 156, 0.1);
  transform: scale(1.05);
}

.logout-icon i {
  font-size: 1.2rem;
}

.main-content {
  padding: 0;
  width: 100%;
}

.welcome-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 64px);
  padding: 4rem 2rem;
  position: relative;
  overflow: hidden;
}

.welcome-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(24, 188, 156, 0.08),
    rgba(46, 204, 113, 0.04)
  );
  z-index: -1;
}

.welcome-content {
  max-width: 800px;
  text-align: center;
  padding: 4rem;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.6) inset;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  position: relative;
  z-index: 1;
  animation: welcomeFadeIn 0.8s ease 0.2s backwards;
}

@keyframes welcomeFadeIn {
  from {
    opacity: 0;
    transform: translateY(25px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.heart-icon {
  font-size: 5rem;
  color: #18bc9c;
  margin-bottom: 2rem;
  display: inline-block;
  animation: heartbeat 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes heartbeat {
  0%,
  100% {
    transform: scale(1);
  }
  15% {
    transform: scale(1.15);
  }
  30% {
    transform: scale(1);
  }
  45% {
    transform: scale(1.1);
  }
  60% {
    transform: scale(1);
  }
}

.welcome-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
  line-height: 1.2;
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-description {
  font-size: 1.1rem;
  color: #64748b;
  line-height: 1.8;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.button-group {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.primary-button {
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(24, 188, 156, 0.25);
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  text-decoration: none;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(24, 188, 156, 0.35);
  color: white;
}

.secondary-button {
  background: transparent;
  color: #18bc9c;
  border: 2px solid #18bc9c;
  padding: 0.8rem 2rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}

.secondary-button:hover {
  background: rgba(24, 188, 156, 0.08);
  transform: translateY(-2px);
  color: #18bc9c;
  text-decoration: none;
}

.decorative-dots {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 0;
}

.dot {
  position: absolute;
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.dot:nth-child(odd) {
  animation-duration: 8s;
  animation-delay: -2s;
}

.dot:nth-child(even) {
  animation-duration: 7s;
  animation-delay: -3s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0) translateX(0);
  }
  33% {
    transform: translateY(-8px) translateX(4px);
  }
  66% {
    transform: translateY(4px) translateX(-6px);
  }
}

.features-section {
  padding: 5rem 2rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.features-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 1rem;
}

.features-title::after {
  content: "";
  display: block;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #18bc9c, #2ecc71);
  margin: 1rem auto 0;
  border-radius: 2px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  background: white;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #18bc9c, #2ecc71);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  transform: translateY(-8px) !important;
  box-shadow: 0 20px 40px rgba(24, 188, 156, 0.15);
  border-color: rgba(24, 188, 156, 0.3);
}

.feature-icon {
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;
  color: #18bc9c;
  transition: all 0.3s ease;
}

.feature-card:hover .feature-icon {
  background: linear-gradient(135deg, #18bc9c, #2ecc71);
  color: white;
  transform: scale(1.1);
}

.feature-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.feature-description {
  color: #64748b;
  line-height: 1.7;
  font-size: 14px;
}

.about-section {
  padding: 5rem 2rem;
  background: #f8fafc;
}

.about-title {
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.about-title::after {
  content: "";
  display: block;
  width: 60px;
  height: 4px;
  background: linear-gradient(90deg, #18bc9c, #2ecc71);
  margin: 1rem auto 0;
  border-radius: 2px;
}

.about-subtitle {
  text-align: center;
  color: #64748b;
  font-size: 1rem;
  margin-bottom: 3rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.about-content {
  max-width: 1200px;
  margin: 0 auto;
}

.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 3rem;
  margin-bottom: 4rem;
}

.about-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  cursor: pointer;
}

.about-card:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 15px 40px rgba(24, 188, 156, 0.12);
  border-color: rgba(24, 188, 156, 0.3);
}

.about-card-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.about-card-title i {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #18bc9c;
  font-size: 1.1rem;
}

.about-card-content {
  color: #64748b;
  line-height: 1.8;
  font-size: 14px;
}

.contact-section {
  background: linear-gradient(135deg, #1a365d 0%, #2c5282 100%);
  padding: 4rem 2rem;
  border-radius: 20px;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
  color: white;
}

.contact-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.contact-item {
  text-align: center;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.contact-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-3px);
}

.contact-icon {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  font-size: 1.4rem;
}

.contact-label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  opacity: 0.9;
}

.contact-value {
  opacity: 0.8;
  font-size: 14px;
}

.contact-section > p {
  opacity: 0.7;
  margin-top: 2rem;
  font-size: 14px;
}

.back-to-home {
  text-align: center;
  margin-top: 3rem;
}

/* Scroll reveal animation */
.scroll-reveal {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 0.7s ease, transform 0.7s ease;
}

.scroll-reveal.revealed {
  opacity: 1;
  transform: translateY(0);
}

.feature-card,
.about-card {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s ease, transform 0.5s ease, box-shadow 0.3s ease;
}

.scroll-reveal.revealed .feature-card,
.scroll-reveal.revealed .about-card {
  opacity: 1;
  transform: translateY(0);
}

.scroll-reveal.revealed .feature-card:nth-child(1),
.scroll-reveal.revealed .about-card:nth-child(1) {
  transition-delay: 0.1s;
}

.scroll-reveal.revealed .feature-card:nth-child(2),
.scroll-reveal.revealed .about-card:nth-child(2) {
  transition-delay: 0.2s;
}

.scroll-reveal.revealed .feature-card:nth-child(3),
.scroll-reveal.revealed .about-card:nth-child(3) {
  transition-delay: 0.3s;
}

.scroll-reveal.revealed .about-card:nth-child(4) {
  transition-delay: 0.4s;
}

@media (max-width: 768px) {
  .header {
    padding: 0.5rem 1rem;
  }

  .header-title {
    font-size: 1.1rem;
  }

  .welcome-section {
    padding: 2rem 1rem;
    min-height: calc(100vh - 56px);
  }

  .welcome-content {
    padding: 2.5rem 1.5rem;
  }

  .welcome-title {
    font-size: 2.2rem;
  }

  .welcome-description {
    font-size: 1.1rem;
  }

  .button-group {
    flex-direction: column;
    align-items: center;
  }

  .primary-button,
  .secondary-button {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }

  .heart-icon {
    font-size: 4rem;
  }

  .features-section,
  .about-section {
    padding: 3rem 1rem;
  }

  .features-title,
  .about-title {
    font-size: 1.8rem;
  }

  .about-grid {
    grid-template-columns: 1fr;
  }

  .user-name,
  .user-role {
    display: none;
  }
}

@media (max-width: 480px) {
  .welcome-title {
    font-size: 1.8rem;
  }

  .welcome-description {
    font-size: 1rem;
  }

  .heart-icon {
    font-size: 3rem;
  }

  .feature-card,
  .about-card {
    padding: 2rem 1.5rem;
  }
}
</style>
