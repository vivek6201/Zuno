import { Router } from "express";
import AuthHandlers from "./handlers";
import { authenticate } from "@/middlewares/authenticate";

export default class AuthRouter {
    private authHandler: AuthHandlers
    private authRouter: Router = Router()
    
    constructor(private readonly router: Router) {
        this.authHandler = new AuthHandlers();
        this.defineRoutes()
        this.router.use("/auth", this.authRouter)
    }

    private defineRoutes(): void {   
        this.authRouter.post("/register", this.authHandler.register);
        this.authRouter.post("/login", this.authHandler.login);
        this.authRouter.delete("/logout", authenticate, this.authHandler.logout);
        this.authRouter.delete("/logout-all", authenticate, this.authHandler.logoutAll);
        this.authRouter.get("/sessions", authenticate, this.authHandler.getSessions);
    }
}