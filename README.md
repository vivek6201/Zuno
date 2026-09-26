# Zuno 🎮

A modern, high-performance **multiplayer classic gaming platform** built with TypeScript, **Bun**, and **Turborepo**. Play classic strategy, card, board, and speed games online with friends in real-time.

---

## 🌟 Highlights

- **🕹️ Multi-Game Hub**: An all-in-one platform hosting classic and modern tabletop games: **Uno**, **Matiks** (mental math), **Ludo**, and **Chess**.
- **⚡ Blazing Fast Monorepo**: Orchestrated with [Turborepo](https://turbo.build/repo) and powered by [Bun](https://bun.sh) package manager and runtime.
- **🧠 Authoritative Game Engine (`@repo/game-engine`)**: Isomorphic, pure TypeScript game engine with pluggable rule sets, state machines, turn controllers, PRNG seeds, and dynamic game registry.
- **🌐 Real-Time WebSocket Infrastructure**: Authenticated WebSocket server with connection heartbeat, lobby roster synchronization, state broadcasts, and reconnect recovery.
- **🔐 Secure Authentication & Session Management**: Express 5 backend with JWT tokens, password hashing via bcrypt, device/IP tracking, and granular session revocation.
- **🗄️ End-to-End Type Safety**: PostgreSQL schema modeling and migrations with [Drizzle ORM](https://orm.drizzle.team) and [Zod](https://zod.dev) validations.
- **⚡ In-Memory Caching & State Store**: Namespaced Redis client wrapper (`@repo/common`) for fast session validation and caching.
- **📦 Standardized API Responses**: Centralized `ApiResponse` utility and global error handling ensuring consistent `{ success, message, data | error }` payloads.
- **🎨 Next-Gen Web Interface**: [Next.js 16](https://nextjs.org/) App Router and [React 19](https://react.dev/) frontend.

---

## 🎲 Featured Games Suite

| Game | Category | Description | Players | Engine Status |
| :--- | :--- | :--- | :---: | :---: |
| **🃏 Uno** | Card Game | Fast-paced card game with colors, numbers, and action cards (Skip, Reverse, +2, Wild, +4). | 2–10 | ✅ Complete |
| **🧮 Matiks** | Mental Math | High-speed mental arithmetic showdown. Solve rapid equations, score points, and outpace opponents. | 2–4 | ✅ Complete |
| **🎲 Ludo** | Board Game | The classic cross-and-circle board game. Roll dice, deploy tokens, capture rivals, and race home safely. | 2–4 | ✅ Complete |
| **♟️ Chess** | Strategy | Timed competitive chess with move validation, FEN snapshot tracking, and clocks. | 2 | ✅ Complete |

---

## 📁 Repository Structure

```text
Zuno/
├── apps/
│   ├── backend/                     # Express 5 REST API & WebSocket Game Server
│   │   ├── src/
│   │   │   ├── config/              # App & environment configuration
│   │   │   ├── errors/              # Typed custom API errors (BadRequest, NotFound, Unauthorized)
│   │   │   ├── middlewares/         # JWT authentication & standardized error handler
│   │   │   ├── modules/
│   │   │   │   ├── auth/            # Auth handlers, repository, router, and service
│   │   │   │   ├── users/           # User profile handlers, repository, and service
│   │   │   │   └── game/            # Multiplayer Game Module
│   │   │   │       ├── handler.ts   # GameRouteHandler (REST controllers)
│   │   │   │       ├── router.ts    # GameRouter (Express /api/v1/rooms routes)
│   │   │   │       ├── room.ts      # Authoritative Room instance & engine bridge
│   │   │   │       ├── room-manager.ts # RoomManager singleton
│   │   │   │       ├── types.ts     # WebSocket message contracts & player models
│   │   │   │       ├── ws-server.ts # GameWebSocketServer (auth, upgrade, heartbeat)
│   │   │   │       └── socket/      # Modular WebSocket event handlers
│   │   │   │           ├── index.ts # SocketMessageHandler dispatcher
│   │   │   │           ├── join-room.ts
│   │   │   │           ├── start-game.ts
│   │   │   │           ├── game-action.ts
│   │   │   │           ├── leave-room.ts
│   │   │   │           └── disconnect.ts
│   │   │   ├── types/               # IGameHandler contract
│   │   │   └── utils/
│   │   │       ├── response.ts      # ApiResponse utility (success, error, throw)
│   │   │       ├── catch-error.ts   # Async tuple error wrapper
│   │   │       ├── session-context.ts
│   │   │       └── game-handlers/   # Game engine adapters (Ludo, Chess, Uno, Matiks)
│   │   └── package.json
│   │
│   └── web/                         # Next.js 16 + React 19 Frontend Client
│       ├── app/                     # Next.js App Router (pages, layouts, styles)
│       └── package.json
│
├── packages/
│   ├── common/                      # Shared utilities, Redis client wrapper, Zod schemas
│   ├── db/                          # Drizzle ORM schema, PostgreSQL client, migrations
│   ├── game-engine/                 # Isomorphic multi-game engine
│   │   ├── src/
│   │   │   ├── core/                # GameManager base, PRNG, TurnManager, Registry
│   │   │   └── games/               # Ludo, Chess, Uno, and Matiks implementations
│   │   └── test/                    # Game engine unit tests
│   ├── ui/                          # Shared React UI component library
│   ├── eslint-config/               # Shared ESLint configuration presets
│   └── typescript-config/           # Base tsconfig presets across workspaces
│
├── turbo.json                       # Turborepo task pipeline configuration
├── bun.lock                         # Bun lockfile
└── package.json                     # Root workspace configuration
```

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Runtime & Package Manager** | [Bun](https://bun.sh/) (`>= 1.3`) |
| **Monorepo Engine** | [Turborepo](https://turbo.build/repo) |
| **Frontend** | [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), Vanilla CSS / CSS Modules |
| **Backend & Real-Time** | [Express 5](https://expressjs.com/), [ws](https://github.com/websockets/ws), TypeScript, Helmet, Morgan, CORS |
| **Game Engine** | Pure TypeScript isomorphic state machines & rule engines (`@repo/game-engine`) |
| **Database & ORM** | [PostgreSQL](https://www.postgresql.org/), [Drizzle ORM](https://orm.drizzle.team/) |
| **Cache & State Store** | [Redis](https://redis.io/) (via [ioredis](https://github.com/redis/ioredis)) |
| **Validation & Security** | [Zod](https://zod.dev/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js), [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have installed:
- [Bun](https://bun.sh/) (`v1.3.14` or higher recommended)
- [Node.js](https://nodejs.org/) (`>= 22`)
- [PostgreSQL](https://www.postgresql.org/) (running locally or via Docker)
- [Redis](https://redis.io/) (running locally or via Docker)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/vivek6201/Zuno.git
cd Zuno
bun install
```

### 2. Configure Environment Variables

Create `.env` in `apps/backend/`:

```bash
cp apps/backend/.env.example apps/backend/.env
```

Update `apps/backend/.env` with your credentials:

```env
# Server
NODE_ENV=development
PORT=8080

# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/zuno

# Auth
JWT_SECRET=your-super-secret-key-min-32-chars

# Redis
REDIS_URL=redis://localhost:6379
```

### 3. Setup the Database

Generate and apply migrations using Drizzle:

```bash
bun --filter @repo/db run drizzle-kit generate
bun --filter @repo/db run drizzle-kit migrate
```

### 4. Run Development Servers

Start all applications and packages concurrently with Turborepo:

```bash
bun run dev
```

- **Frontend (web)**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:8080](http://localhost:8080)
- **WebSocket Server**: `ws://localhost:8080/ws`

---

## 📜 Monorepo Scripts

Run these commands from the root directory:

| Command | Description |
| :--- | :--- |
| `bun run dev` | Start development servers for all apps (`web` & `backend`) |
| `bun run build` | Build all apps and packages |
| `bun run lint` | Run ESLint across all projects |
| `bun run check-types` | Run TypeScript type checks across all workspaces |
| `bun run format` | Format files with Prettier |

### Filtering Tasks

Run commands for a single app or package using `--filter`:

```bash
# Run only backend in dev mode
bun exec turbo dev --filter=backend

# Run only web in dev mode
bun exec turbo dev --filter=web

# Typecheck only game-engine
bun exec turbo check-types --filter=@repo/game-engine

# Run game-engine tests
bun test --filter=@repo/game-engine
```

---

## 🔌 API Reference (Backend)

Base path: `/api/v1`

### 1. Standard Response Envelope

All REST endpoints return standardized responses via the `ApiResponse` utility:

- **Success (`200`/`201`)**:
  ```json
  {
    "success": true,
    "message": "Room created successfully",
    "data": { ... }
  }
  ```
- **Error (`400`/`401`/`404`/`500`)**:
  ```json
  {
    "success": false,
    "message": "Room not found",
    "error": "Room not found"
  }
  ```

---

### 2. Game Rooms (`/rooms`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/rooms` | List active rooms (optional filter: `?gameType=LUDO`) | Yes |
| `POST` | `/rooms` | Create a new room with custom rules and player caps | Yes |
| `GET` | `/rooms/:roomId` | Fetch room metadata and current player roster | Yes |

---

### 3. Authentication (`/auth`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/auth/register` | Register a new user | No |
| `POST` | `/auth/login` | Log in and receive access token & session | No |
| `DELETE` | `/auth/logout` | Revoke current active session | Yes |
| `DELETE` | `/auth/logout-all`| Revoke all active sessions for current user | Yes |
| `GET` | `/auth/sessions` | List active sessions with device/IP details | Yes |

---

### 4. Users (`/users`)

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/users` | Get sanitized list of users | Yes |
| `GET` | `/users/me` | Fetch authenticated user information | Yes |
| `GET` | `/users/profile` | Fetch user profile metadata | Yes |

---

## ⚡ WebSocket Real-Time Protocol

Connect to the WebSocket server using an authenticated JWT:

```text
ws://localhost:8080/ws?token=<JWT_TOKEN>&roomId=<OPTIONAL_ROOM_ID>
```

### Client Messages (`ClientMessage`)

| Type | Payload | Description |
| :--- | :--- | :--- |
| `PING` | `{}` | Heartbeat check. Server replies with `PONG`. |
| `JOIN_ROOM` | `{ "roomId": "..." }` | Join an existing room (or create if absent). |
| `START_GAME`| `{}` | Host initiates the match once players are ready. |
| `GAME_ACTION` | `{ "action": { "type": "...", ... } }` | Dispatches move (dice roll, token move, card play). |
| `LEAVE_ROOM`| `{}` | Voluntarily leave the room. |

### Server Messages (`ServerMessage`)

| Type | Payload | Trigger |
| :--- | :--- | :--- |
| `ROOM_JOINED` | `{ roomId, gameType, players, isHost, maxPlayers }` | Sent to the player upon entering the room lobby. |
| `PLAYER_JOINED` | `{ player: RoomPlayerInfo }` | Broadcasted to room when a new player enters. |
| `PLAYER_LEFT` | `{ playerId: string }` | Broadcasted when a player exits. |
| `PLAYER_DISCONNECTED` | `{ playerId: string }` | Broadcasted when a player loses connection. |
| `PLAYER_RECONNECTED` | `{ playerId: string }` | Broadcasted when a disconnected player reconnects. |
| `GAME_STARTED` | `{ gameType, state }` | Broadcasted to all players when match begins. |
| `GAME_STATE_UPDATE` | `{ gameType, state }` | Broadcasted on every authoritative state mutation. |
| `GAME_EVENT` | `{ event }` | Sub-game sound/animation triggers (dice rolled, bonus turn). |
| `ERROR` | `{ message: string }` | Sent directly to client on invalid or illegal moves. |
| `PONG` | `{}` | Heartbeat response. |

---

## 🧭 Project Status & Roadmap

- [x] **Monorepo Architecture**: Turborepo workspace setup with Bun, TypeScript, and shared tooling
- [x] **Authentication & Sessions**: Full JWT auth flow, session tracking, device fingerprints, and Redis caching
- [x] **Database & Caching Layer**: PostgreSQL schemas with Drizzle ORM and Redis client wrapper
- [x] **Standardized Response Envelope**: Uniform `{ success, message, data | error }` and typed error handling
- [x] **Multi-Game Engine Core (`@repo/game-engine`)**:
  - [x] **Core Framework**: `GameManager` base class, `TurnManager`, PRNG seed generator, and registry
  - [x] **Ludo Engine**: 4-player board coordinates, dice rolls, safe squares, token collisions/captures, and home runs
  - [x] **Chess Engine**: Board state, FEN notation, legal move validation, check/checkmate detection, and clocks
  - [x] **Uno Engine**: Card decks, turn rotation, color selection, action cards (+2, Skip, Reverse, Wild, Wild +4)
  - [x] **Matiks Engine**: Mental math equation scoring, answer validation, streaks, and round transitions
- [x] **Multiplayer & Networking**:
  - [x] Authoritative `Room` and `RoomManager` instances
  - [x] WebSocket server with JWT authentication handshake
  - [x] Modular socket handlers (`join-room`, `start-game`, `game-action`, `leave-room`, `disconnect`)
  - [x] Real-time lobby state sync, automatic host transfer, and reconnect recovery
- [ ] **Web Application UI**:
  - [ ] Game lobby browser and friend invitation cards
  - [ ] Interactive game boards with micro-animations and sound effects
- [ ] **Leaderboards & Player Stats**: Elo rating, win/loss history, and game-specific achievements

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
