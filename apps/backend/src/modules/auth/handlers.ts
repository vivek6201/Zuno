import { Request, Response } from "express";
import AuthService from "./service";
import { loginUser, registerUser } from "@repo/common/validations/user";
import { BadRequestError, UnauthorizedError } from "@/errors";
import { extractSessionContext } from "@/utils/session-context";
import { ApiResponse } from "@/utils/response";

export default class AuthHandlers {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    const result = await registerUser.safeParseAsync(req.body);
    if (!result.success) {
      throw new BadRequestError(
        "Invalid request body",
        result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      );
    }

    const { name, email, password } = result.data;
    const ctx = extractSessionContext(req);
    const session = await this.authService.register(
      { name, email, password },
      ctx,
    );

    ApiResponse.success(
      res,
      {
        token: session.token,
        expiresAt: session.expiresAt,
      },
      "Registration successful",
      201,
    );
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const result = await loginUser.safeParseAsync(req.body);
    if (!result.success) {
      throw new BadRequestError(
        "Invalid request body",
        result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      );
    }
    const { email, password } = result.data;
    const ctx = extractSessionContext(req);

    const session = await this.authService.login(email, password, ctx);

    ApiResponse.success(
      res,
      {
        token: session.token,
        expiresAt: session.expiresAt,
      },
      "Login successful",
      200,
    );
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    const token = req.token;
    if (!token) throw new UnauthorizedError("Not authenticated");

    await this.authService.logout(token);

    ApiResponse.success(res, null, "Logged out successfully");
  };

  public logoutAll = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedError("Not authenticated");

    await this.authService.logoutAll(userId);

    ApiResponse.success(res, null, "Logged out from all sessions successfully");
  };

  public getAllSessions = async (
    req: Request,
    res: Response,
  ): Promise<void> => {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedError("Not authenticated");

    const sessions = await this.authService.getAllSessions(userId, req.token);

    ApiResponse.success(
      res,
      { sessions },
      "Active sessions retrieved successfully",
    );
  };
}
