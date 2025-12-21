import type { RouteRecordRaw } from "vue-router";
import Dashboard from "../../views/admin/dashboard.vue";
import Users from "../../views/admin/users/index.vue";
import UsersCreate from "../../views/admin/users/create.vue";
import UsersEdit from "../../views/admin/users/edit.vue";
import UsersShow from "../../views/admin/users/show.vue";
import UsersProfile from "../../views/admin/profile.vue";
import Course from "../../views/admin/course/index.vue";
import CourseCreate from "../../views/admin/course/create.vue";
import CourseEdit from "../../views/admin/course/edit.vue";
import CourseShow from "../../views/admin/course/show.vue";
import CourseType from "../../views/admin/course-type/index.vue";
import CourseTypeCreate from "../../views/admin/course-type/create.vue";
import CourseTypeEdit from "../../views/admin/course-type/edit.vue";

const AdminRouter: RouteRecordRaw[] = [
  {
    path: "/admin/dashboard",
    name: "admin.dashboard",
    component: Dashboard,
    meta: {
      title: "Dashboard",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/users",
    name: "admin.users",
    component: Users,
    meta: {
      title: "Users",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/users/create",
    name: "admin.users.create",
    component: UsersCreate,
    meta: {
      title: "Create User",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/users/:id/edit",
    name: "admin.users.edit",
    component: UsersEdit,
    meta: {
      title: "Edit User",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/users/:id",
    name: "admin.users.show",
    component: UsersShow,
    meta: {
      title: "Show User",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/profile",
    name: "admin.profile",
    component: UsersProfile,
    meta: {
      title: "Profile",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/course",
    name: "admin.course",
    component: Course,
    meta: {
      title: "Course",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/course/create",
    name: "admin.course.create",
    component: CourseCreate,
    meta: {
      title: "Create Course",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/course/:id(\\d+)/edit",
    name: "admin.course.edit",
    component: CourseEdit,
    meta: {
      title: "Edit Course",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/course/:id(\\d+)",
    name: "admin.course.show",
    component: CourseShow,
    meta: {
      title: "Show Course",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/course-type",
    name: "admin.course-type",
    component: CourseType,
    meta: {
      title: "Course Types",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/course-type/create",
    name: "admin.course-type.create",
    component: CourseTypeCreate,
    meta: {
      title: "Create Course Type",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/course-type/:id/edit",
    name: "admin.course-type.edit",
    component: CourseTypeEdit,
    meta: {
      title: "Edit Course Type",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
];

export default AdminRouter;
