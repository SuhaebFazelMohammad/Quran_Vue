import { defineStore } from "pinia";

type Theme = "dark" | "light";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    isDark: false,
  }),

  actions: {
    applyTheme(persist: boolean = true) {
      document.documentElement.classList.toggle("dark", this.isDark);
      document.body?.classList.toggle("dark", this.isDark);
      if (persist) {
        const theme: Theme = this.isDark ? "dark" : "light";
        localStorage.setItem("theme", theme);
      }
    },

    toggleTheme() {
      this.isDark = !this.isDark;
      this.applyTheme();
    },

    setTheme(dark: boolean) {
      this.isDark = dark;
      this.applyTheme();
    },

    loadTheme() {
      const saved = localStorage.getItem("theme") as Theme | null;
      if (saved) {
        this.isDark = saved === "dark";
        this.applyTheme(false);
        return;
      }

      this.isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      this.applyTheme(false);
    },

    setupSystemListener() {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", (event: MediaQueryListEvent) => {
        if (!localStorage.getItem("theme")) {
          this.isDark = event.matches;
          this.applyTheme(false);
        }
      });
    },
  },
});
