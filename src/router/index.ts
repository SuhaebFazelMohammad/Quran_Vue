import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "../stores/userStore";

import GuestRoutes from "./routes/guest";
import AdminRoutes from "./routes/admin";

const routes = [...GuestRoutes, ...AdminRoutes];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard to protect admin routes
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    // If user is not authenticated, redirect to login
    if (!userStore.isAuthenticated) {
      next({
        name: "login",
        query: { redirect: to.fullPath }, // Save the intended destination
      });
      return;
    }
    // User is authenticated, allow access
    next();
  } else if (to.name === "login" && userStore.isAuthenticated) {
    // If user is already logged in and tries to access login page, redirect to dashboard
    next({ name: "dashboard" });
  } else {
    // Route doesn't require auth, allow access
    next();
  }
});

export default router;
