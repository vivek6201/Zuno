import { ApiResponse, AuthResponse, User } from "@repo/common/api/routes";
import {
  LoginUserInput,
  RegisterUserInput,
} from "@repo/common/validations/user";

export type ActionResult =
  | {
      success: true;
      message?: string;
    }
  | {
      success: false;
      error?: string;
    };

export interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;

  login: (data: LoginUserInput) => Promise<ActionResult>;
  register: (data: RegisterUserInput) => Promise<ActionResult>;
  logout: () => Promise<ActionResult>;
  bootstrap: () => Promise<ActionResult>;
  setUser: (user: User) => void;
  completeOnboarding: () => Promise<ActionResult>;
}
