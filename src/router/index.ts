import { createRouter, createWebHistory } from "vue-router";

import GuestRoutes from "./routes/guest";
import AdminRoutes from "./routes/admin";

const routes = [...GuestRoutes, ...AdminRoutes];

export default createRouter({
  history: createWebHistory(),
  routes,
});