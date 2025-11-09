import type { RouteRecordRaw } from "vue-router";
import Dashboard from "../../views/admin/dashboard.vue";
import Users from "../../views/admin/users/index.vue";
import UsersCreate from '../../views/admin/users/create.vue'
import UsersEdit from '../../views/admin/users/edit.vue'
import UsersShow from '../../views/admin/users/show.vue'

const AdminRouter: RouteRecordRaw[] = [
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: {
      title: "Dashboard",
      requiresAuth: true,
    },
  },
  {
    path: "/users",
    name: "users",
    component: Users,
    meta: {
      title: "Users",
      requiresAuth: true,
    },
  },
  {
    path: "/users/create",
    name: "users-create",
    component: UsersCreate,
    meta: {
      title: "Create User",
      requiresAuth: true,
    },
  },
  {
    path: "/users/:id/edit",
    name: "users-edit",
    component: UsersEdit,
    meta: {
      title: "Edit User",
      requiresAuth: true,
    },
  },
  {
    path: "/users/:id",
    name: "users-show",
    component: UsersShow,
    meta: {
      title: "Show User",
      requiresAuth: true,
    },
  }
];

export default AdminRouter;
