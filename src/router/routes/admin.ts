import type { RouteRecordRaw } from "vue-router";
import Dashboard from "../../views/admin/dashboard.vue";
import Users from "../../views/admin/users/index.vue";
import UsersCreate from "../../views/admin/users/create.vue";
import UsersEdit from "../../views/admin/users/edit.vue";
import UsersShow from "../../views/admin/users/show.vue";
import UsersProfile from "../../views/admin/profile.vue";
import Course from "../../views/admin/course/index.vue";
import CourseEdit from "../../views/admin/course/edit.vue";
import CourseShow from "../../views/admin/course/show.vue";

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
  },
  {
    path: "/users/profile",
    name: "users-profile",
    component: UsersProfile,
    meta: {
      title: "Profile",
      requiresAuth: true,
    },
  },
  {
    path: "/course",
    name: "course",
    component: Course,
    meta: {
      title: "Course",
      requiresAuth: true,
    },
  },
  {
    path: "/course/:id(\\d+)/edit",
    name: "course-edit",
    component: CourseEdit,
    meta: {
      title: "Edit Course",
      requiresAuth: true,
    },
  },
  {
    path: "/course/:id(\\d+)",
    name: "course-show",
    component: CourseShow,
    meta: {
      title: "Show Course",
      requiresAuth: true,
    },
  },
];

export default AdminRouter;
