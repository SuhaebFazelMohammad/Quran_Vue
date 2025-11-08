<template>
  <div
    class="min-h-dvh bg-[radial-gradient(1200px_800px_at_10%_10%,rgba(87,13,248,0.08),transparent),radial-gradient(800px_600px_at_90%_10%,rgba(9,176,255,0.08),transparent),linear-gradient(180deg,#0b1020_0%,#0a0d1a_100%)] text-slate-200 flex items-center justify-center px-4"
  >
    <div class="w-full max-w-md">
      <div
        class="bg-white/5 backdrop-blur-md border border-indigo-400/20 rounded-2xl shadow-2xl shadow-black/40 px-6 py-7"
      >
        <div class="flex flex-col items-center gap-2 mb-3">
          <h1 class="m-0 text-xl font-bold">Welcome back</h1>
          <p class="m-0 text-slate-400 text-sm">Please sign in to continue</p>
        </div>

        <form class="grid gap-3 mt-1" @submit.prevent="onSubmit">
          <div class="grid gap-2">
            <label for="email" class="text-sm text-slate-300">Email</label>
            <input
              id="email"
              type="email"
              v-model.trim="form.email"
              placeholder="you@example.com"
              autocomplete="email"
              :class="[
                'w-full rounded-xl bg-white/5 border px-3 py-2.5 outline-none text-slate-100 placeholder:text-slate-400 transition focus:ring-4',
                errors.email
                  ? 'border-red-500/80 ring-0 focus:ring-red-500/20'
                  : 'border-slate-400/20 focus:border-indigo-400/60 focus:ring-indigo-500/20',
              ]"
            />
            <p v-if="errors.email" class="m-0 text-xs text-red-300">
              {{ errors.email }}
            </p>
          </div>

          <div class="grid gap-2">
            <label for="password" class="text-sm text-slate-300"
              >Password</label
            >
            <div class="relative">
              <input
                id="password"
                :type="showPassword ? 'text' : 'password'"
                v-model.trim="form.password"
                placeholder="••••••••"
                autocomplete="current-password"
                :class="[
                  'w-full rounded-xl bg-white/5 border px-3 py-2.5 outline-none text-slate-100 placeholder:text-slate-400 transition pr-16 focus:ring-4',
                  errors.password
                    ? 'border-red-500/80 ring-0 focus:ring-red-500/20'
                    : 'border-slate-400/20 focus:border-indigo-400/60 focus:ring-indigo-500/20',
                ]"
              />
              <button
                type="button"
                class="absolute inset-y-0 right-2 my-auto h-9 px-3 text-xs text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/5 transition"
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
            class="mt-1 inline-flex w-full items-center justify-center rounded-xl border border-indigo-400/30 bg-gradient-to-b from-indigo-500 to-indigo-600 text-white font-semibold py-2.5 shadow-lg shadow-indigo-600/30 hover:brightness-105 active:translate-y-px transition disabled:opacity-75 disabled:cursor-not-allowed"
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

        <div
          class="grid grid-cols-[1fr_auto_1fr] items-center gap-3 my-5 text-slate-400 text-xs"
        >
          <div
            class="h-px bg-gradient-to-r from-indigo-400/20 to-transparent"
          ></div>
          <span>or continue with</span>
          <div
            class="h-px bg-gradient-to-l from-indigo-400/20 to-transparent"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";

interface LoginFormState {
  email: string;
  password: string;
  remember: boolean;
}

const form = reactive<LoginFormState>({
  email: "",
  password: "",
  remember: true,
});

const errors = reactive<{ email: string | null; password: string | null }>({
  email: null,
  password: null,
});

const showPassword = ref(false);
const loading = ref(false);
const serverMessage = ref("");
const serverMessageType = ref<"success" | "error">("success");
const router = useRouter();

function validate(): boolean {
  errors.email = null;
  errors.password = null;

  let ok = true;
  if (!form.email) {
    errors.email = "Email is required";
    ok = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address";
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

  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 600));
  router.push({ name: "dashboard" });
  loading.value = false;
}
</script>
