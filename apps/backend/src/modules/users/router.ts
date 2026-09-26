import { Router } from "express";
import UserHandlers from "./handlers";
import { authenticate } from "@/middlewares/authenticate";

export default class UsersRouter {
    private userHandlers: UserHandlers
    private userRouter = Router();

    constructor(private readonly router: Router){
        this.userHandlers = new UserHandlers();
        this.defineRoutes()
        this.router.use("/users", this.userRouter);
    }

    private defineRoutes(): void {
        this.userRouter.get("/", authenticate, this.userHandlers.getAllUsers);
        this.userRouter.get("/me", authenticate, this.userHandlers.getCurrentUser);
        this.userRouter.get("/profile", authenticate, this.userHandlers.getProfile);
    }
} 