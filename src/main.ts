import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { useThemeStore } from "./stores/darkMode";

const app = createApp(App);
const pinia = createPinia();

app.use(router);
app.use(pinia);

const themeStore = useThemeStore(pinia);
themeStore.loadTheme();
themeStore.setupSystemListener();

app.mount("#app");
