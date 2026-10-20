import ludoIcon from "@assets/images/ludo-transparent.png";
import unoIcon from "@assets/images/uno-image.png";
import matiksIcon from "@assets/images/matiks-image.png";
import chessIcon from "@assets/images/chess-image.png";
import { GameItem } from "@/types/games";

export const MODE_GRADIENT_LOCATIONS: [number, number, ...number[]] = [
  0, 0.08, 0.18, 0.25, 0.3, 0.35, 0.4,
];

export const GAMES_LIST: GameItem[] = [
  {
    id: "ludo",
    title: "Ludo",
    subtitle: "Classic board game for 2-4 players",
    icon: ludoIcon,
    colors: ["#0284C7", "#2563EB", "#1E40AF"],
  },
  {
    id: "uno",
    title: "UNO",
    subtitle: "Match cards, score and win",
    icon: unoIcon,
    colors: ["#F43F5E", "#EF4444", "#B91C1C"],
  },
  {
    id: "matiks",
    title: "Matiks",
    subtitle: "Strategize, make moves, win the round",
    icon: matiksIcon,
    colors: ["#8B5CF6", "#7C3AED", "#581C87"],
  },
  {
    id: "chess",
    title: "Chess",
    subtitle: "Think. Plan. Checkmate.",
    icon: chessIcon,
    colors: ["#22C55E", "#16A34A", "#14532D"],
  },
];
