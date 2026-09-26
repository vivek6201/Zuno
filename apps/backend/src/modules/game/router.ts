import { Router } from "express";
import { authenticate } from "@/middlewares/authenticate";
import GameRouteHandler from "./handler";

export default class GameRouter {
  private gameHandler: GameRouteHandler;
  private gameRouter = Router();

  constructor(private readonly router: Router) {
    this.gameHandler = new GameRouteHandler();
    this.defineRoutes();
    this.router.use("/rooms", this.gameRouter);
  }

  private defineRoutes(): void {
    // 1. List active rooms (with optional ?gameType= filter)
    this.gameRouter.get("/", authenticate, this.gameHandler.listRooms);

    // 2. Create room dynamically for specified game and config
    this.gameRouter.post("/", authenticate, this.gameHandler.createRoom);

    // 3. Get room info
    this.gameRouter.get("/:roomId", authenticate, this.gameHandler.getRoom);
  }
}
