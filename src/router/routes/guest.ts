import type { RouteRecordRaw } from "vue-router";

import Login from "../../views/auth/login.vue";

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
];

export default guestRoutes;
