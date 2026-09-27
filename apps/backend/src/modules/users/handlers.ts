import { Request, Response } from "express";
import UserService from "./service";
import { UnauthorizedError } from "@/errors";
import { ApiResponse } from "@/utils/response";

export default class UserHandlers {
    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    public getAllUsers = async (req: Request, res: Response): Promise<void> => {
        const users = await this.service.getAll();
        const sanitizedUsers = users.map(({ password, ...user }) => user);

        ApiResponse.success(
            res,
            { users: sanitizedUsers },
            "Users retrieved successfully"
        );
    };

    public getCurrentUser = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) throw new UnauthorizedError("Not authenticated");

        const user = await this.service.getById(userId);
        const { password, ...sanitizedUser } = user;

        ApiResponse.success(
            res,
            sanitizedUser,
            "Current user retrieved successfully"
        );
    };

    public getProfile = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) throw new UnauthorizedError("Not authenticated");

        const profile = await this.service.getProfile(userId);

        ApiResponse.success(
            res,
            profile,
            "User profile retrieved successfully"
        );
    };
}