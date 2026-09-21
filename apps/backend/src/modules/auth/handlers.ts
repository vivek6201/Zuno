import { Request, Response } from "express";
import AuthService from "./service";
import { loginUser, registerUser } from "@repo/common/validations/user"
import { BadRequestError, UnauthorizedError } from "src/errors";
import { extractSessionContext } from "src/utils/session-context";

export default class AuthHandlers {
    private authService: AuthService

    constructor() {
        this.authService = new AuthService();
    }

    public register = async (req: Request, res: Response): Promise<void> => {
        const result = await registerUser.safeParseAsync(req.body);
        if (!result.success) {
            throw new BadRequestError("Invalid request body", result.error.issues.map(issue => ({
                path: issue.path.join("."),
                message: issue.message
            })));
        }

        const { name, email, password } = result.data;
        const ctx = extractSessionContext(req);
        const session = await this.authService.register({ name, email, password }, ctx);

        res.status(201).json({
            message: "Registration successful",
            token: session.token,
            expiresAt: session.expiresAt,
        });
    };

    public login = async (req: Request, res: Response): Promise<void> => {
        const result = await loginUser.safeParseAsync(req.body);
        if (!result.success) {
            throw new BadRequestError("Invalid request body", result.error.issues.map(issue => ({
                path: issue.path.join("."),
                message: issue.message
            })));
        }
        const { email, password } = result.data;
        const ctx = extractSessionContext(req);

        const session = await this.authService.login(email, password, ctx);

        res.status(200).json({
            message: "Login successful",
            token: session.token,
            expiresAt: session.expiresAt,
        });
    };

    public logout = async (req: Request, res: Response): Promise<void> => {
        const token = req.token;
        if (!token) throw new UnauthorizedError("Not authenticated");

        await this.authService.logout(token);

        res.status(200).json({ message: "Logged out successfully" });
    };

    public logoutAll = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) throw new UnauthorizedError("Not authenticated");

        await this.authService.logoutAll(userId);

        res.status(200).json({ message: "Logged out from all sessions successfully" });
    };

    public getAllSessions = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) throw new UnauthorizedError("Not authenticated");

        const sessions = await this.authService.getAllSessions(userId, req.token);

        res.status(200).json({
            message: "Active sessions retrieved successfully",
            sessions,
        });
    };

    public getSessions = this.getAllSessions;
}