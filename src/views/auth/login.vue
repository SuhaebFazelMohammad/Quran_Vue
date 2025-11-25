<template>
  <div
    class="relative min-h-dvh bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-200 flex items-center justify-center px-4 overflow-hidden"
  >
    <div
      class="pointer-events-none absolute inset-0 -z-10 bg-mesh-dark opacity-90"
    ></div>
    <div
      class="pointer-events-none absolute inset-x-0 top-[-20%] h-[480px] bg-gradient-to-b from-amber-500/20 via-transparent to-transparent blur-3xl"
    ></div>
    <div class="w-full max-w-md">
      <div
        class="surface-card border border-slate-700/60 bg-slate-950/80 px-8 py-10 shadow-2xl shadow-black/50"
      >
        <div class="flex flex-col items-center gap-3 mb-6 text-center">
          <h1 class="m-0 text-2xl font-semibold text-white tracking-tight">
            Welcome back
          </h1>
          <p class="m-0 text-sm text-slate-400">
            Sign in to keep the recitation experience thriving.
          </p>
        </div>

        <form class="grid gap-4" @submit.prevent="onSubmit">
          <div class="grid gap-2 text-left">
            <label for="login" class="text-sm font-medium text-slate-300"
              >Login</label
            >
            <input
              id="login"
              type="text"
              v-model.trim="form.login"
              placeholder="Email or username"
              autocomplete="username"
              :class="[
                'w-full rounded-xl border bg-slate-900/70 px-3 py-3 outline-none text-slate-100 placeholder:text-slate-500 transition focus:ring-4',
                errors.login
                  ? 'border-red-500/80 ring-0 focus:ring-red-500/20'
                  : 'border-slate-700/70 focus:border-amber-400 focus:ring-amber-400/20',
              ]"
            />
            <p v-if="errors.login" class="m-0 text-xs text-red-300">
              {{ errors.login }}
            </p>
          </div>

          <div class="grid gap-2 text-left">
            <label for="password" class="text-sm font-medium text-slate-300">
              Password
            </label>
            <div class="relative">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model.trim="form.password"
                placeholder="••••••••"
                autocomplete="current-password"
                :class="[
                  'w-full rounded-xl border bg-slate-900/70 px-3 py-3 pr-16 outline-none text-slate-100 placeholder:text-slate-500 transition focus:ring-4',
                  errors.password
                    ? 'border-red-500/80 ring-0 focus:ring-red-500/20'
                    : 'border-slate-700/70 focus:border-amber-400 focus:ring-amber-400/20',
                ]"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-2 my-auto inline-flex h-9 items-center rounded-lg px-3 text-xs text-slate-400 transition hover:bg-slate-800/60 hover:text-slate-200"
                aria-label="Toggle password visibility"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? "Hide" : "Show" }}
              </button>
            </div>
            <p v-if="errors.password" class="m-0 text-xs text-red-300">
              {{ errors.password }}
            </p>
          </div>

          <button
            class="glass-button w-full justify-center bg-amber-500/95 py-2.5 font-semibold shadow-amber-500/30 transition disabled:cursor-not-allowed disabled:opacity-70"
            type="submit"
            :disabled="loading"
          >
            <span v-if="!loading">Sign in</span>
            <span
              v-else
              class="inline-block size-[18px] animate-spin rounded-full border-2 border-white/60 border-r-transparent"
              aria-label="Loading"
            ></span>
          </button>

          <p
            v-if="serverMessage"
            :class="[
              'm-0 mt-1 text-sm px-3 py-2 rounded-lg border',
              serverMessageType === 'success'
                ? 'bg-emerald-500/10 border-emerald-400/40 text-emerald-200'
                : 'bg-red-500/10 border-red-400/40 text-red-200',
            ]"
          >
            {{ serverMessage }}
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "../../stores/userStore";

interface LoginFormState {
  login: string;
  password: string;
  remember: boolean;
}

const form = reactive<LoginFormState>({
  login: "",
  password: "",
  remember: true,
});

const errors = reactive<{ login: string | null; password: string | null }>({
  login: null,
  password: null,
});

const showPassword = ref(false);
const serverMessage = ref("");
const serverMessageType = ref<"success" | "error">("success");
const router = useRouter();
const userStore = useUserStore();

const loading = computed(() => userStore.loading);

function validate(): boolean {
  errors.login = null;
  errors.password = null;

  let ok = true;
  if (!form.login) {
    errors.login = "Login is required";
    ok = false;
  }

  if (!form.password) {
    errors.password = "Password is required";
    ok = false;
  } else if (form.password.length < 6) {
    errors.password = "Must be at least 6 characters";
    ok = false;
  }

  return ok;
}

async function onSubmit() {
  serverMessage.value = "";
  if (!validate()) return;

  const result = await userStore.login({
    login: form.login,
    password: form.password,
    remember: form.remember,
  });

  if (result.success) {
    serverMessage.value = "Login successful! Redirecting...";
    serverMessageType.value = "success";

    // Redirect to intended page or dashboard
    const redirect = router.currentRoute.value.query.redirect as string;
    router.push(redirect || { name: "dashboard" });
  } else {
    serverMessage.value = result.message || "Login failed. Please try again.";
    serverMessageType.value = "error";
  }
}
</script>
