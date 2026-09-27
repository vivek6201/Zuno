import http from "node:http";
import express, { Express, Router } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { IConfig } from "./config";
import { errorHandler } from "./middlewares/error-handler";
import AuthRouter from "./modules/auth/router";
import GameRouter from "./modules/game/router";
import { GameWebSocketServer } from "./ws-server";
import UsersRouter from "./modules/users/router";
import cors from "cors";

export default class App {
  private app: Express;
  private server: http.Server;
  private router: Router;
  private wsServer: GameWebSocketServer | null = null;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
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
    this.app.use(cors({ credentials: true, origin: true }));
  }

  private initializeRoutes(): void {
    this.app.use("/api/v1", this.router);

    new AuthRouter(this.router);
    new UsersRouter(this.router);
    new GameRouter(this.router);

    this.app.use(errorHandler);
  }

  public getServer(): Express {
    return this.app;
  }

  public getHttpServer(): http.Server {
    return this.server;
  }

  public getWebSocketServer(): GameWebSocketServer | null {
    return this.wsServer;
  }

  public start(config: IConfig): void {
    // Initialize WebSocket server attached to the HTTP server
    this.wsServer = new GameWebSocketServer(this.server, config.jwtSecret);

    this.server.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
      console.log(
        `WebSocket server listening on ws://localhost:${config.port}/ws`,
      );
    });
  }
}
