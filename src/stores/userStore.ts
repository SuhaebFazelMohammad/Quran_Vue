import { defineStore } from "pinia";
import { computed, ref } from "vue";
import {
  login as apiLogin,
  logout as apiLogout,
  type LoginResponse,
} from "../api/auth";

interface User {
  id: number;
  name: string;
  email: string;
  [key: string]: any;
}

interface LoginCredentials {
  login: string;
  password: string;
  remember?: boolean;
}

export const useUserStore = defineStore("user", () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);

  const isAuthenticated = computed(() => !!token.value && !!user.value);

  // Load user data from localStorage on initialization
  function loadFromStorage() {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      token.value = storedToken;
      try {
        user.value = JSON.parse(storedUser);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        clearStorage();
      }
    }
  }

  // Save to localStorage
  function saveToStorage(remember: boolean = true) {
    if (remember && token.value && user.value) {
      localStorage.setItem("auth_token", token.value);
      localStorage.setItem("auth_user", JSON.stringify(user.value));
    }
  }

  // Clear localStorage
  function clearStorage() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  }

  // Login function
  async function login(
    credentials: LoginCredentials
  ): Promise<{ success: boolean; message?: string }> {
    loading.value = true;

    try {
      const response: LoginResponse = await apiLogin(credentials);

      user.value = response.user;
      token.value = response.token;
      saveToStorage(credentials.remember ?? true);

      return { success: true };
    } catch (error: any) {
      // Enhanced error handling
      console.error("Login error:", error);

      let message = "Login failed. Please try again.";

      if (error.response) {
        // Server responded with error
        const errorData = error.response.data;

        // Handle Laravel validation errors
        if (errorData.errors) {
          const firstError = Object.values(errorData.errors)[0];
          message = Array.isArray(firstError)
            ? firstError[0]
            : String(firstError);
        } else if (errorData.message) {
          message = errorData.message;
        } else if (error.response.status === 401) {
          message = "Invalid login or password";
        } else if (error.response.status === 422) {
          message = "Validation error. Please check your input.";
        } else if (error.response.status === 500) {
          message = "Server error. Please try again later.";
        }
      } else if (error.request) {
        // Request was made but no response received
        message = "Unable to connect to server. Please check your connection.";
      } else {
        // Something else happened
        message = error.message || "An unexpected error occurred";
      }

      return { success: false, message };
    } finally {
      loading.value = false;
    }
  }

  // Logout function
  async function logout() {
    try {
      // Call API logout endpoint
      await apiLogout();
    } catch (error) {
      // Even if API call fails, clear local state
      console.error("Logout API error:", error);
    } finally {
      // Always clear local state
      user.value = null;
      token.value = null;
      clearStorage();
    }
  }

  // Update user data
  function updateUser(updatedUser: Partial<User>) {
    if (user.value) {
      user.value = { ...user.value, ...updatedUser };
      saveToStorage();
    }
  }

  // Initialize store from localStorage
  loadFromStorage();

  return {
    user: computed(() => user.value),
    token: computed(() => token.value),
    isAuthenticated,
    loading: computed(() => loading.value),
    login,
    logout,
    updateUser,
    loadFromStorage,
  };
});
