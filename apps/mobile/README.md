# Zuno Mobile 📱

Cross-platform mobile client for **Zuno**, built with **Expo SDK 57**, **React Native 0.86**, **Expo Router**, and **Uniwind / TailwindCSS**.

---

## 🌟 Highlights & Features

- **🏠 Home Dashboard (`/(tabs)`)**:
  - Pinned diagonal royal-blue gradient header with dynamic time-based greeting (`Good Morning / Afternoon / Evening, Vivek 👋`).
  - Notification badge and avatar profile shortcut.
  - Interactive **Quick Play** banner.
  - **Draggable Bottom Sheet** (`@gorhom/bottom-sheet`): Default snap point at ~68%, expandable to 95% with `BottomSheetScrollView`.
  - **Your Stats**: Nested horizontal scroll view isolated via `GestureDetector` (`Gesture.Native()`) with screen-responsive card widths (2 cards on small screens, 3 on medium, 4 on large).
  - **Popular Games**: Quick access icons for Ludo, UNO, Matiks, and Chess.

- **🎮 Choose a Game (`/(tabs)/games`)**:
  - Clean header with custom [BackButton](file:///Users/vivek/Desktop/projects/Zuno/apps/mobile/src/components/common/back-button.tsx).
  - Elevated Bottom Sheet resting at `91%` snap point.
  - **`GameCard` Component**: Reusable card with linear gradient background, zero-background 3D game artwork, bold title, subtitle, and right arrow indicator.
  - Sizing dynamically adapts to screen size via `useWindowDimensions()`.

- **🔐 Authentication & Onboarding**:
  - Interactive multi-slide onboarding flow with custom illustrations.
  - Login, registration, password recovery, and reset password screens.
  - Secure token storage with `expo-secure-store` and `zustand` auth state management.

- **⚡ Monorepo Integration**:
  - Shares models, validation schemas (`Zod`), and color tokens directly from `@repo/common`.
  - Configured with Metro monorepo symlink resolution.

---

## 📁 Project Structure

```text
apps/mobile/
├── assets/
│   └── images/
│       ├── ludo-transparent.png     # Zero-background 3D Ludo render
│       ├── uno-transparent.png      # Zero-background 3D UNO cards render
│       ├── matiks-transparent.png   # Zero-background 3D Matiks tiles render
│       ├── chess-transparent.png    # Zero-background 3D Chess pieces render
│       ├── quick-play.jpg           # Quick play banner asset
│       └── onboarding/              # Onboarding carousel illustrations
├── src/
│   ├── app/
│   │   ├── _layout.tsx              # Root layout with GestureHandlerRootView & HeroUI provider
│   │   ├── index.tsx                # Initial entry route (redirects to onboarding / auth / tabs)
│   │   ├── splash-screen.tsx        # Splash loading screen
│   │   ├── onboarding/              # Multi-step introduction screens
│   │   ├── (auth)/                  # Login, Register, Forgot Password, Reset Password
│   │   ├── (tabs)/                  # Main bottom-tab navigation
│   │   │   ├── _layout.tsx          # Tab bar configuration & custom icons
│   │   │   ├── home.tsx             # Home dashboard with stats & quick play
│   │   │   ├── games.tsx            # Choose a game catalog
│   │   │   ├── history.tsx          # Match history & past games
│   │   │   └── profile.tsx          # User profile & settings
│   │   ├── games/[gameId]/lobby.tsx # Multiplayer game lobby screen
│   │   └── game/[roomId].tsx        # Real-time game arena
│   ├── components/
│   │   ├── common/                  # BackButton, RootWrapper
│   │   ├── tabs/home/               # QuickPlayCard, RecentGameCard, StatsCard
│   │   └── tabs/games/              # GameCard
│   ├── hooks/                       # useAuthStore, useWebSocket
│   └── store/                       # Zustand auth store
├── app.json                         # Expo app configuration
├── metro.config.js                  # Metro monorepo resolution config
├── tailwind.config.js               # Uniwind/Tailwind configuration
└── tsconfig.json                    # Path aliases (@/*, @assets/*, @repo/*)
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) (`>= 1.3`)
- [Expo Go](https://expo.dev/go) app on your physical iOS/Android device, or an iOS Simulator / Android Emulator.

### Running Locally

From the root of the monorepo:

```bash
# Start the mobile app dev server
bun --filter mobile start --clear
```

Or directly from `apps/mobile`:

```bash
cd apps/mobile
bun start --clear
```

### Available Scripts

| Command               | Description                                          |
| :-------------------- | :--------------------------------------------------- |
| `bun start`           | Starts the Expo development server                   |
| `bun run ios`         | Starts development server targeting iOS Simulator    |
| `bun run android`     | Starts development server targeting Android Emulator |
| `bun run check-types` | Validates TypeScript types across the mobile app     |
