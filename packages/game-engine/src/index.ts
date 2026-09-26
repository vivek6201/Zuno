// Core Exports
export * from "./core";

// Game Modules
export * as Ludo from "./games/ludo";
export * as Chess from "./games/chess";
export * as Uno from "./games/uno";
export * as Matiks from "./games/matiks";

// Default export is the base GameManager
export { GameManager as default } from "./core/game-manager";

