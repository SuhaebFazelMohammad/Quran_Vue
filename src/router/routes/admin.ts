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
import Tafsir from "../../views/admin/tafsir/index.vue";
import TafsirCreate from "../../views/admin/tafsir/create.vue";
import TafsirEdit from "../../views/admin/tafsir/edit.vue";
import Permission from "../../views/admin/permission/index.vue";
import CenterTypes from "../../views/admin/center-types/index.vue";
import CenterTypesCreate from "../../views/admin/center-types/create.vue";
import CenterTypesEdit from "../../views/admin/center-types/edit.vue";
import QuranCenters from "../../views/admin/quran-centers/index.vue";
import QuranCentersCreate from "../../views/admin/quran-centers/create.vue";
import QuranCentersEdit from "../../views/admin/quran-centers/edit.vue";
import UserCenters from "../../views/admin/user-centers/index.vue";
import UserCentersCreate from "../../views/admin/user-centers/create.vue";
import UserCentersEdit from "../../views/admin/user-centers/edit.vue";

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
  {
    path: "/admin/tafsir",
    name: "admin.tafsir",
    component: Tafsir,
    meta: {
      title: "Tafsir",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/tafsir/create",
    name: "admin.tafsir.create",
    component: TafsirCreate,
    meta: {
      title: "Create Tafsir",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/tafsir/:id/edit",
    name: "admin.tafsir.edit",
    component: TafsirEdit,
    meta: {
      title: "Edit Tafsir",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/permission",
    name: "admin.permission",
    component: Permission,
    meta: {
      title: "Permission",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/center-types",
    name: "admin.center-types",
    component: CenterTypes,
    meta: {
      title: "Center Types",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/center-types/create",
    name: "admin.center-types.create",
    component: CenterTypesCreate,
    meta: {
      title: "Create Center Type",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/center-types/:id/edit",
    name: "admin.center-types.edit",
    component: CenterTypesEdit,
    meta: {
      title: "Edit Center Type",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/quran-centers",
    name: "admin.quran-centers",
    component: QuranCenters,
    meta: {
      title: "Quran Centers",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/quran-centers/create",
    name: "admin.quran-centers.create",
    component: QuranCentersCreate,
    meta: {
      title: "Create Quran Center",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/quran-centers/:id/edit",
    name: "admin.quran-centers.edit",
    component: QuranCentersEdit,
    meta: {
      title: "Edit Quran Center",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/user-centers",
    name: "admin.user-centers",
    component: UserCenters,
    meta: {
      title: "User Centers",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/user-centers/create",
    name: "admin.user-centers.create",
    component: UserCentersCreate,
    meta: {
      title: "Create User Center",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
  {
    path: "/admin/user-centers/:id/edit",
    name: "admin.user-centers.edit",
    component: UserCentersEdit,
    meta: {
      title: "Edit User Center",
      requiresAuth: true,
      requiresAdmin: true,
    },
  },
];

export default AdminRouter;
