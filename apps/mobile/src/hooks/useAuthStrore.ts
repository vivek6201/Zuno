import { create } from "zustand";
import { ActionResult, AuthState } from "../store/auth";
import { authRoutes } from "@repo/common/api/routes/auth";
import { userRoutes } from "@repo/common/api/routes/users";
import * as SecureStore from "expo-secure-store";
import { setAuthToken } from "@repo/common/api/client";

const useAuthStore = create<AuthState>((set) => {
  const clearAuth = (hasSeenOnboarding?: boolean) => {
    set((state) => ({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      hasSeenOnboarding:
        hasSeenOnboarding !== undefined
          ? hasSeenOnboarding
          : state.hasSeenOnboarding,
    }));
  };

  const handleAuthSuccess = async (
    token: string,
    successMessage: string,
  ): Promise<ActionResult> => {
    await SecureStore.setItemAsync("token", token);
    setAuthToken(token);

    const user = await userRoutes.getMe();
    if (user.success) {
      await SecureStore.setItemAsync("hasSeenOnboarding", "true");
      set({
        token,
        isAuthenticated: true,
        user: user.data,
        isLoading: false,
        hasSeenOnboarding: true,
      });

      return {
        success: true,
        message: successMessage,
      };
    }

    clearAuth();
    return {
      success: false,
      error: user.message,
    };
  };

  return {
    token: null,
    user: null,
    isLoading: true,
    isAuthenticated: false,
    hasSeenOnboarding: false,

    login: async (data) => {
      try {
        const res = await authRoutes.login(data);
        if (res.success) {
          return await handleAuthSuccess(
            res.data.token,
            "User logged in successfully",
          );
        }

        clearAuth();
        return {
          success: false,
          error: res.message,
        };
      } catch (error) {
        console.log(error);
        clearAuth();
        return {
          success: false,
          error: (error as any)?.message,
        };
      }
    },

    register: async (data) => {
      try {
        const res = await authRoutes.register(data);
        if (res.success) {
          return await handleAuthSuccess(
            res.data.token,
            "User registered successfully",
          );
        }

        clearAuth();
        return {
          success: false,
          error: res.message,
        };
      } catch (error) {
        console.log(error);
        clearAuth();
        return {
          success: false,
          error: (error as any)?.message as string,
        };
      }
    },

    logout: async () => {
      try {
        const res = await authRoutes.logout();
        await SecureStore.deleteItemAsync("token");
        clearAuth();

        if (res.success) {
          return {
            success: true,
            message: "User logged out successfully",
          };
        } else {
          return {
            success: false,
            error: res.message,
          };
        }
      } catch (error) {
        await SecureStore.deleteItemAsync("token");
        clearAuth();
        return {
          success: false,
          error: (error as any)?.message,
        };
      }
    },

    bootstrap: async () => {
      try {
        const hasSeenOnboarding =
          (await SecureStore.getItemAsync("hasSeenOnboarding")) === "true";
        const token = await SecureStore.getItemAsync("token");

        if (!token) {
          clearAuth(hasSeenOnboarding);
          return {
            success: false,
            error: "No token found",
          };
        }

        setAuthToken(token);
        const user = await userRoutes.getMe();
        if (user.success) {
          set({
            token,
            isAuthenticated: true,
            user: user.data,
            isLoading: false,
            hasSeenOnboarding: true,
          });

          return {
            success: true,
            message: "User logged in successfully",
          };
        }

        clearAuth(hasSeenOnboarding);
        return {
          success: false,
          error: user.message,
        };
      } catch (error) {
        let hasSeenOnboarding = false;
        try {
          hasSeenOnboarding =
            (await SecureStore.getItemAsync("hasSeenOnboarding")) === "true";
        } catch {}

        clearAuth(hasSeenOnboarding);
        return {
          success: false,
          error: (error as any)?.message,
        };
      }
    },

    setUser: async (user) => {
      set({ user });
    },

    completeOnboarding: async () => {
      const hasSeenOnboarding =
        await SecureStore.getItemAsync("hasSeenOnboarding");
      if (hasSeenOnboarding) {
        set({ hasSeenOnboarding: true });
        return {
          success: true,
          message: "Onboarding already completed",
        };
      }
      await SecureStore.setItemAsync("hasSeenOnboarding", "true");
      set({ hasSeenOnboarding: true });

      return {
        success: true,
        message: "Onboarding completed successfully",
      };
    },
  };
});

export default useAuthStore;
