import type { RouteRecordRaw } from "vue-router";

import Login from "../../views/auth/login.vue";
import NotFound from "../../views/errors/not-found.vue";

const guestRoutes: RouteRecordRaw[] = [
  {
    path: "/",
    redirect: "/dashboard",
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "Login",
      requiresAuth: false,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFound,
    meta: {
      title: "Page Not Found",
      requiresAuth: false,
    },
  },
];

export default guestRoutes;
