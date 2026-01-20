<template>
  <Teleport to="body">
    <transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="close"
        ></div>

        <!-- Modal Content -->
        <transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div
            v-if="isOpen"
            class="relative w-full max-w-2xl rounded-2xl border border-amber-200/70 bg-white/95 shadow-2xl shadow-amber-400/25 backdrop-blur-xl dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:shadow-slate-950"
          >
            <!-- Header -->
            <div
              class="flex items-center justify-between border-b border-amber-200/60 bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 px-6 py-4 dark:border-slate-800/60"
            >
              <div class="flex items-center gap-3">
                <div
                  class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 shadow-lg shadow-amber-400/30"
                >
                  <Icon
                    icon="heroicons:information-circle-20-solid"
                    class="h-7 w-7 text-white"
                  />
                </div>
                <div>
                  <h3
                    class="text-lg font-bold text-slate-800 dark:text-amber-100"
                  >
                    Course Information
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    Notification Details
                  </p>
                </div>
              </div>
              <button
                type="button"
                class="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-300 dark:hover:bg-slate-800 dark:hover:text-amber-200"
                @click="close"
                aria-label="Close"
              >
                <Icon icon="heroicons:x-mark-20-solid" class="h-5 w-5" />
              </button>
            </div>

            <!-- Content -->
            <div class="max-h-[70vh] overflow-y-auto p-6">
              <div v-if="!hasData" class="text-center py-12">
                <Icon
                  icon="heroicons:information-circle-20-solid"
                  class="mx-auto h-12 w-12 text-slate-400"
                />
                <p class="mt-4 text-sm text-slate-500 dark:text-slate-400">
                  No information available
                </p>
                <!-- Debug: Show data structure -->
                <div
                  v-if="props.data && Object.keys(props.data).length > 0"
                  class="mt-6 rounded-lg bg-slate-100 dark:bg-slate-800 p-4 text-left"
                >
                  <p
                    class="mb-2 text-xs font-semibold text-slate-600 dark:text-slate-400"
                  >
                    Debug - Data Structure:
                  </p>
                  <pre
                    class="overflow-auto text-xs text-slate-700 dark:text-slate-300"
                  >
                    {{ JSON.stringify(props.data, null, 2) }}
                  </pre>
                </div>
              </div>
              <div v-else class="space-y-6">
                <!-- Course Type Name - Beautiful Paragraph -->
                <div
                  v-if="courseTypeName"
                  class="rounded-xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 p-6 shadow-sm border-l-4 border-amber-500 dark:from-amber-950/30 dark:via-slate-950/90 dark:to-amber-950/20"
                >
                  <p
                    class="mb-3 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400"
                  >
                    Course Type
                  </p>
                  <p
                    class="text-xl font-bold leading-relaxed text-slate-900 dark:text-amber-50"
                  >
                    {{ courseTypeName }}
                  </p>
                </div>

                <!-- Description - Beautiful Paragraph -->
                <div
                  v-if="description"
                  class="rounded-xl bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 p-6 shadow-sm border-l-4 border-blue-500 dark:from-blue-950/30 dark:via-slate-950/90 dark:to-blue-950/20"
                >
                  <p
                    class="mb-3 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400"
                  >
                    Description
                  </p>
                  <p
                    class="text-base leading-relaxed text-slate-800 dark:text-slate-200"
                  >
                    {{ description }}
                  </p>
                </div>

                <!-- User Information -->
                <div
                  v-if="hasUserInfo"
                  class="overflow-hidden rounded-2xl border border-emerald-200/70 bg-gradient-to-br from-white via-emerald-50/30 to-white shadow-xl transition hover:shadow-2xl dark:border-slate-800/60 dark:from-slate-950 dark:via-emerald-950/20 dark:to-slate-950"
                >
                  <!-- Header with gradient -->
                  <div
                    class="bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 px-6 py-5"
                  >
                    <div class="flex items-center gap-4">
                      <div
                        class="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-2 ring-white/30"
                      >
                        <Icon
                          icon="heroicons:user-circle-20-solid"
                          class="h-8 w-8 text-white"
                        />
                      </div>
                      <div class="min-w-0 flex-1">
                        <h3 class="text-lg font-bold text-white">
                          User Information
                        </h3>
                        <p class="text-sm text-emerald-50/90">
                          Personal details
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Content -->
                  <div class="p-6 space-y-6">
                    <!-- First Name - Beautiful Paragraph -->
                    <div
                      v-if="firstName"
                      class="rounded-xl bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 p-5 shadow-sm border-l-4 border-emerald-500 dark:from-emerald-950/30 dark:via-slate-950/90 dark:to-emerald-950/20"
                    >
                      <p
                        class="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
                      >
                        First Name
                      </p>
                      <p
                        class="text-lg font-semibold leading-relaxed text-slate-900 dark:text-amber-50"
                      >
                        {{ firstName }}
                      </p>
                    </div>

                    <!-- Last Name - Beautiful Paragraph -->
                    <div
                      v-if="lastName"
                      class="rounded-xl bg-gradient-to-br from-emerald-50/80 via-white to-emerald-50/40 p-5 shadow-sm border-l-4 border-emerald-500 dark:from-emerald-950/30 dark:via-slate-950/90 dark:to-emerald-950/20"
                    >
                      <p
                        class="mb-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400"
                      >
                        Last Name
                      </p>
                      <p
                        class="text-lg font-semibold leading-relaxed text-slate-900 dark:text-amber-50"
                      >
                        {{ lastName }}
                      </p>
                    </div>

                    <!-- Email - Beautiful Paragraph -->
                    <div
                      v-if="userEmail"
                      class="rounded-xl bg-gradient-to-br from-blue-50/80 via-white to-blue-50/40 p-5 shadow-sm border-l-4 border-blue-500 dark:from-blue-950/30 dark:via-slate-950/90 dark:to-blue-950/20"
                    >
                      <p
                        class="mb-2 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400"
                      >
                        Email Address
                      </p>
                      <a
                        :href="`mailto:${userEmail}`"
                        class="text-lg font-semibold leading-relaxed text-blue-600 hover:text-blue-700 hover:underline transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {{ userEmail }}
                      </a>
                    </div>

                    <!-- Phone Numbers - Beautiful Paragraphs -->
                    <template v-if="userPhoneNumbers.length > 0">
                      <div
                        v-for="(phone, index) in userPhoneNumbers"
                        :key="index"
                        class="rounded-xl bg-gradient-to-br from-cyan-50/80 via-white to-cyan-50/40 p-5 shadow-sm border-l-4 border-cyan-500 dark:from-cyan-950/30 dark:via-slate-950/90 dark:to-cyan-950/20"
                      >
                        <p
                          class="mb-2 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400"
                        >
                          Phone
                          {{
                            userPhoneNumbers.length > 1
                              ? `Number ${index + 1}`
                              : "Number"
                          }}
                        </p>
                        <a
                          :href="`tel:${phone}`"
                          class="text-lg font-semibold leading-relaxed text-cyan-600 hover:text-cyan-700 hover:underline transition-colors dark:text-cyan-400 dark:hover:text-cyan-300"
                        >
                          {{ phone }}
                        </a>
                      </div>
                    </template>

                    <!-- Gender - Beautiful Paragraph -->
                    <div
                      v-if="userGender"
                      class="rounded-xl bg-gradient-to-br from-purple-50/80 via-white to-purple-50/40 p-5 shadow-sm border-l-4 border-purple-500 dark:from-purple-950/30 dark:via-slate-950/90 dark:to-purple-950/20"
                    >
                      <p
                        class="mb-2 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400"
                      >
                        Gender
                      </p>
                      <p
                        class="text-lg font-semibold leading-relaxed text-slate-900 dark:text-amber-50"
                      >
                        {{ userGender }}
                      </p>
                    </div>

                    <!-- Date of Birth - Beautiful Paragraph -->
                    <div
                      v-if="userDateOfBirth"
                      class="rounded-xl bg-gradient-to-br from-orange-50/80 via-white to-orange-50/40 p-5 shadow-sm border-l-4 border-orange-500 dark:from-orange-950/30 dark:via-slate-950/90 dark:to-orange-950/20"
                    >
                      <p
                        class="mb-2 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400"
                      >
                        Date of Birth
                      </p>
                      <p
                        class="text-lg font-semibold leading-relaxed text-slate-900 dark:text-amber-50"
                      >
                        {{ formatDateOfBirth(userDateOfBirth) }}
                      </p>
                    </div>

                    <!-- Role - Beautiful Paragraph -->
                    <div
                      v-if="userRole"
                      class="rounded-xl bg-gradient-to-br from-indigo-50/80 via-white to-indigo-50/40 p-5 shadow-sm border-l-4 border-indigo-500 dark:from-indigo-950/30 dark:via-slate-950/90 dark:to-indigo-950/20"
                    >
                      <p
                        class="mb-2 text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400"
                      >
                        Role
                      </p>
                      <span
                        class="inline-flex items-center rounded-full px-4 py-2 text-base font-semibold shadow-sm"
                        :class="getRoleClass(userRole)"
                      >
                        {{ userRole }}
                      </span>
                    </div>

                    <!-- City - Beautiful Paragraph -->
                    <div
                      v-if="userCity"
                      class="rounded-xl bg-gradient-to-br from-amber-50/80 via-white to-amber-50/40 p-5 shadow-sm border-l-4 border-amber-500 dark:from-amber-950/30 dark:via-slate-950/90 dark:to-amber-950/20"
                    >
                      <p
                        class="mb-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400"
                      >
                        City
                      </p>
                      <p
                        class="text-lg font-semibold leading-relaxed text-slate-900 dark:text-amber-50"
                      >
                        {{ userCity }}
                      </p>
                    </div>

                    <!-- Address - Beautiful Paragraph -->
                    <div
                      v-if="userAddress"
                      class="rounded-xl bg-gradient-to-br from-slate-50/80 via-white to-slate-50/40 p-5 shadow-sm border-l-4 border-slate-500 dark:from-slate-950/30 dark:via-slate-950/90 dark:to-slate-950/20"
                    >
                      <p
                        class="mb-2 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400"
                      >
                        Address
                      </p>
                      <p
                        class="text-lg font-semibold leading-relaxed text-slate-900 dark:text-amber-50"
                      >
                        {{ userAddress }}
                      </p>
                    </div>
                  </div>
                </div>

                <!-- Date - Beautiful Paragraph -->
                <div
                  v-if="date"
                  class="rounded-xl bg-gradient-to-br from-purple-50/80 via-white to-purple-50/40 p-6 shadow-sm border-l-4 border-purple-500 dark:from-purple-950/30 dark:via-slate-950/90 dark:to-purple-950/20"
                >
                  <p
                    class="mb-3 text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400"
                  >
                    Date
                  </p>
                  <p
                    class="text-lg font-semibold leading-relaxed text-slate-900 dark:text-amber-50"
                  >
                    {{ formatDate(date) }}
                  </p>
                </div>

                <!-- Address - Beautiful Paragraph -->
                <div
                  v-if="address"
                  class="rounded-xl bg-gradient-to-br from-orange-50/80 via-white to-orange-50/40 p-6 shadow-sm border-l-4 border-orange-500 dark:from-orange-950/30 dark:via-slate-950/90 dark:to-orange-950/20"
                >
                  <p
                    class="mb-3 text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400"
                  >
                    Address
                  </p>
                  <p
                    class="text-base leading-relaxed text-slate-800 dark:text-slate-200"
                  >
                    {{ address }}
                  </p>
                </div>

                <!-- Phone Numbers - Beautiful Paragraphs -->
                <template v-if="phoneNumbers.length > 0">
                  <div
                    v-for="(phone, index) in phoneNumbers"
                    :key="index"
                    class="rounded-xl bg-gradient-to-br from-cyan-50/80 via-white to-cyan-50/40 p-6 shadow-sm border-l-4 border-cyan-500 dark:from-cyan-950/30 dark:via-slate-950/90 dark:to-cyan-950/20"
                  >
                    <p
                      class="mb-3 text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400"
                    >
                      Phone
                      {{
                        phoneNumbers.length > 1
                          ? `Number ${index + 1}`
                          : "Number"
                      }}
                    </p>
                    <a
                      :href="`tel:${phone}`"
                      class="text-lg font-semibold leading-relaxed text-cyan-600 hover:text-cyan-700 hover:underline transition-colors dark:text-cyan-400 dark:hover:text-cyan-300"
                    >
                      {{ phone }}
                    </a>
                  </div>
                </template>
              </div>
            </div>

            <!-- Footer -->
            <div
              class="flex items-center justify-end gap-3 border-t border-amber-200/60 bg-slate-50/50 px-6 py-4 dark:border-slate-800/60 dark:bg-slate-900/50"
            >
              <button
                type="button"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-400/40 transition hover:brightness-110 focus:outline-none focus:ring-4 focus:ring-amber-300/50 dark:from-amber-400 dark:via-amber-500 dark:to-amber-400"
                @click="close"
              >
                <Icon icon="heroicons:check-20-solid" class="h-5 w-5" />
                Got it
              </button>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, watch } from "vue";
import { Icon } from "@iconify/vue";

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    data?: Record<string, any>;
  }>(),
  {
    modelValue: false,
    data: () => ({}),
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

function close() {
  isOpen.value = false;
}

// Extract specific fields
const courseTypeName = computed(() => {
  const data = props.data || {};
  return (
    data.type_course_name ||
    data.typeCourseName ||
    data.name ||
    data.type_course?.name ||
    data.typeCourse?.name ||
    ""
  );
});

const description = computed(() => {
  return props.data?.description || "";
});

// User information - extract from user object or direct fields
// Check multiple possible locations for user data
const firstName = computed(() => {
  const data = props.data || {};
  const user = data.user || {};
  const userAttr = data.user?.attribute || data.user?.attr || {};
  const userId = data.user_id || data.userId;

  // Check if user_id is an object with user data directly (not nested)
  // Structure: user_id: { first_name, last_name, email, ... }
  const userIdDirect =
    userId && typeof userId === "object" && !userId.user ? userId : {};

  // Check nested structure: user_id.user.attribute (like in courses)
  const nestedUser = userId?.user || {};
  const nestedAttr = nestedUser?.attribute || nestedUser?.attr || {};

  return (
    userIdDirect.first_name ||
    nestedAttr.first_name ||
    nestedUser.first_name ||
    user.first_name ||
    data.first_name ||
    userAttr.first_name ||
    user.name?.split(" ")[0] ||
    ""
  );
});

const lastName = computed(() => {
  const data = props.data || {};
  const user = data.user || {};
  const userAttr = data.user?.attribute || data.user?.attr || {};
  const userId = data.user_id || data.userId;

  // Check if user_id is an object with user data directly (not nested)
  // Structure: user_id: { first_name, last_name, email, ... }
  const userIdDirect =
    userId && typeof userId === "object" && !userId.user ? userId : {};

  // Check nested structure: user_id.user.attribute (like in courses)
  const nestedUser = userId?.user || {};
  const nestedAttr = nestedUser?.attribute || nestedUser?.attr || {};

  return (
    userIdDirect.last_name ||
    nestedAttr.last_name ||
    nestedUser.last_name ||
    user.last_name ||
    data.last_name ||
    userAttr.last_name ||
    user.name?.split(" ").slice(1).join(" ") ||
    ""
  );
});

const fullName = computed(() => {
  if (firstName.value && lastName.value) {
    return `${firstName.value} ${lastName.value}`;
  }
  if (firstName.value) {
    return firstName.value;
  }
  if (lastName.value) {
    return lastName.value;
  }
  // Try to get name from other locations
  const data = props.data || {};
  const user = data.user || {};
  return user.name || data.name || "";
});

const userEmail = computed(() => {
  const data = props.data || {};
  const user = data.user || {};
  const userAttr = data.user?.attribute || data.user?.attr || {};
  const userId = data.user_id || data.userId;

  // Check if user_id is an object with user data directly (not nested)
  // Structure: user_id: { first_name, last_name, email, ... }
  const userIdDirect =
    userId && typeof userId === "object" && !userId.user ? userId : {};

  // Check nested structure: user_id.user.attribute (like in courses)
  const nestedUser = userId?.user || {};
  const nestedAttr = nestedUser?.attribute || nestedUser?.attr || {};

  return (
    userIdDirect.email ||
    nestedAttr.email ||
    nestedUser.email ||
    user.email ||
    data.email ||
    userAttr.email ||
    ""
  );
});

// Parse phone numbers - handle JSON array or comma-separated string
const userPhoneNumbers = computed(() => {
  const data = props.data || {};
  const user = data.user || {};
  const userId = data.user_id || data.userId;

  // Check if user_id is an object with user data directly (not nested)
  // Structure: user_id: { first_name, last_name, email, ... }
  const userIdDirect =
    userId && typeof userId === "object" && !userId.user ? userId : {};

  // Check nested structure: user_id.user.attribute (like in courses)
  const nestedUser = userId?.user || {};
  const nestedAttr = nestedUser?.attribute || nestedUser?.attr || {};

  // Try multiple locations for phone_num
  // First check data.phone_num (course phone numbers as array)
  const coursePhoneNum = data.phone_num;

  // Then check user phone numbers
  const userPhoneNum =
    userIdDirect.phone_num ||
    nestedAttr.phone_num ||
    nestedUser.phone_num ||
    user.phone_num ||
    "";

  // If course has phone_num array, use that first
  if (coursePhoneNum) {
    if (Array.isArray(coursePhoneNum)) {
      return coursePhoneNum.filter(Boolean);
    }
    if (typeof coursePhoneNum === "string") {
      try {
        const parsed = JSON.parse(coursePhoneNum);
        if (Array.isArray(parsed)) {
          return parsed.filter(Boolean);
        }
      } catch {
        return coursePhoneNum
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean);
      }
    }
  }

  // Otherwise use user phone_num
  if (!userPhoneNum) return [];

  // If it's already an array
  if (Array.isArray(userPhoneNum)) {
    return userPhoneNum.filter(Boolean);
  }

  // If it's a string, try to parse as JSON
  if (typeof userPhoneNum === "string") {
    try {
      const parsed = JSON.parse(userPhoneNum);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch {
      // If not JSON, treat as comma-separated string
      return userPhoneNum
        .split(",")
        .map((p) => p.trim())
        .filter(Boolean);
    }
  }

  // If it's a single value, return as array with one item
  return [String(userPhoneNum)].filter(Boolean);
});

const userGender = computed(() => {
  const data = props.data || {};
  const user = data.user || {};
  const userId = data.user_id || data.userId;

  // Check if user_id is an object with user data directly (not nested)
  const userIdDirect =
    userId && typeof userId === "object" && !userId.user ? userId : {};

  // Check nested structure: user_id.user.attribute (like in courses)
  const nestedUser = userId?.user || {};
  const nestedAttr = nestedUser?.attribute || nestedUser?.attr || {};

  const gender =
    userIdDirect.gender ||
    nestedAttr.gender ||
    nestedUser.gender ||
    user.gender ||
    data.gender ||
    "";

  if (gender === "1" || gender === 1) {
    return "Male";
  }
  if (gender === "2" || gender === 2) {
    return "Female";
  }

  return "";
});

const userDateOfBirth = computed(() => {
  const data = props.data || {};
  const user = data.user || {};
  const userId = data.user_id || data.userId;

  // Check if user_id is an object with user data directly (not nested)
  const userIdDirect =
    userId && typeof userId === "object" && !userId.user ? userId : {};

  // Check nested structure: user_id.user.attribute (like in courses)
  const nestedUser = userId?.user || {};
  const nestedAttr = nestedUser?.attribute || nestedUser?.attr || {};

  return (
    userIdDirect.date_of_birth ||
    nestedAttr.date_of_birth ||
    nestedUser.date_of_birth ||
    user.date_of_birth ||
    data.date_of_birth ||
    ""
  );
});

const userRole = computed(() => {
  const data = props.data || {};
  const user = data.user || {};
  const userId = data.user_id || data.userId;

  // Check if user_id is an object with user data directly (not nested)
  const userIdDirect =
    userId && typeof userId === "object" && !userId.user ? userId : {};

  // Check nested structure: user_id.user.attribute (like in courses)
  const nestedUser = userId?.user || {};
  const nestedAttr = nestedUser?.attribute || nestedUser?.attr || {};

  const role =
    userIdDirect.role ||
    nestedAttr.role ||
    nestedUser.role ||
    user.role ||
    data.role ||
    "";

  if (role === "1" || role === 1) {
    return "Admin";
  }
  if (role === "2" || role === 2) {
    return "Moderator";
  }
  if (role === "3" || role === 3) {
    return "User";
  }

  return "";
});

const userCity = computed(() => {
  const data = props.data || {};
  const user = data.user || {};
  const userId = data.user_id || data.userId;

  // Check if user_id is an object with user data directly (not nested)
  const userIdDirect =
    userId && typeof userId === "object" && !userId.user ? userId : {};

  // Check nested structure: user_id.user.attribute (like in courses)
  const nestedUser = userId?.user || {};
  const nestedAttr = nestedUser?.attribute || nestedUser?.attr || {};

  return (
    userIdDirect.city ||
    nestedAttr.city ||
    nestedUser.city ||
    user.city ||
    data.city ||
    ""
  );
});

const userAddress = computed(() => {
  const data = props.data || {};
  const user = data.user || {};
  const userId = data.user_id || data.userId;

  // Check if user_id is an object with user data directly (not nested)
  const userIdDirect =
    userId && typeof userId === "object" && !userId.user ? userId : {};

  // Check nested structure: user_id.user.attribute (like in courses)
  const nestedUser = userId?.user || {};
  const nestedAttr = nestedUser?.attribute || nestedUser?.attr || {};

  return (
    userIdDirect.address ||
    nestedAttr.address ||
    nestedUser.address ||
    user.address ||
    data.address ||
    ""
  );
});

const hasUserInfo = computed(() => {
  return !!(
    firstName.value ||
    lastName.value ||
    fullName.value ||
    userEmail.value ||
    userPhoneNumbers.value.length > 0 ||
    userGender.value ||
    userDateOfBirth.value ||
    userRole.value ||
    userCity.value ||
    userAddress.value
  );
});

// Get role badge classes
function getRoleClass(role: string): string {
  if (role === "Admin") {
    return "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300";
  }
  if (role === "Moderator") {
    return "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300";
  }
  if (role === "User") {
    return "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300";
  }
  return "bg-slate-100 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300";
}

const date = computed(() => {
  return props.data?.date || "";
});

const address = computed(() => {
  return props.data?.address || "";
});

// Parse phone numbers
const phoneNumbers = computed(() => {
  const phoneNum = props.data?.phone_num || props.data?.phoneNum;
  if (!phoneNum) return [];

  if (Array.isArray(phoneNum)) {
    return phoneNum.filter(Boolean);
  }

  if (typeof phoneNum === "string") {
    try {
      const parsed = JSON.parse(phoneNum);
      if (Array.isArray(parsed)) {
        return parsed.filter(Boolean);
      }
    } catch {
      // If not JSON, treat as comma-separated string
      return phoneNum
        .split(",")
        .map((p: string) => p.trim())
        .filter(Boolean);
    }
  }

  return [];
});

const hasData = computed(() => {
  return !!(
    courseTypeName.value ||
    description.value ||
    hasUserInfo.value ||
    date.value ||
    address.value ||
    phoneNumbers.value.length > 0
  );
});

// Format date (with time)
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  } catch {
    return dateString;
  }
}

// Format date of birth (date only)
function formatDateOfBirth(dateString: string): string {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch {
    return dateString;
  }
}

// Close on Escape key
watch(isOpen, (open) => {
  if (open) {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }
});
</script>
