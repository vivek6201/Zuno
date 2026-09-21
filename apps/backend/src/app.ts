import LoadConfig, { IConfig } from "./config";
import express, { Express, Router } from "express"
import AuthRouter from "./modules/auth/router";
import { errorHandler } from "./middlewares/error-handler";
import helmet from "helmet";
import morgan from "morgan";
import UsersRouter from "./modules/users/router";

export default class App {
    private app: Express
    private router: Router

    constructor() {
        this.app = express();
        this.router = Router();
        this.initializeMiddleware();
        this.initializeRoutes();
    }

    private initializeMiddleware(): void {
        const isDev = process.env.NODE_ENV !== "production";
        this.app.use(morgan(isDev ? "dev" : "combined"));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(helmet());
    }

    private initializeRoutes(): void {
        this.app.use("/api/v1", this.router)
        

        new AuthRouter(this.router);
        new UsersRouter(this.router)

        this.app.use(errorHandler);
    }

    public getServer(): Express {
        return this.app;
    }

    public start(config: IConfig): void {
        this.app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });
    }
}