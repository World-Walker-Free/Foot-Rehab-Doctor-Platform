import { createRouter, createWebHashHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Information from "@/views/Information.vue";
import Welcome from "@/views/Welcome.vue";
import Report from "@/views/Report.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/welcome",
    name: "Welcome",
    component: Welcome,
    meta: { requiresAuth: true },
  },
  {
    path: "/information",
    name: "Information",
    component: Information,
    meta: { requiresAuth: true },
  },
  {
    path: "/report/:id",
    name: "Report",
    component: Report,
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL), // 改成 createWebHashHistory
  routes,
});

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isLoggedIn) {
      next("/login");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;
