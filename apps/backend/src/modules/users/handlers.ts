import { Request, Response } from "express";
import UserService from "./service";
import { UnauthorizedError, BadRequestError } from "src/errors";

export default class UserHandlers {
    private service: UserService;

    constructor() {
        this.service = new UserService();
    }

    public getAllUsers = async (req: Request, res: Response): Promise<void> => {
        const users = await this.service.getAll();
        const sanitizedUsers = users.map(({ password, ...user }) => user);

        res.status(200).json({
            status: "success",
            data: { users: sanitizedUsers },
        });
    };

    public getCurrentUser = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) throw new UnauthorizedError("Not authenticated");

        const user = await this.service.getById(userId);
        const { password, ...sanitizedUser } = user;

        res.status(200).json({
            status: "success",
            data: sanitizedUser,
        });
    };

    public getProfile = async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        if (!userId) throw new UnauthorizedError("Not authenticated");

        const profile = await this.service.getProfile(userId);

        res.status(200).json({
            status: "success",
            data: profile ,
        });
    };
}