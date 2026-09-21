# Zuno 🎮

A modern, high-performance **multiplayer classic gaming platform** built with TypeScript, **Bun**, and **Turborepo**. Play classic strategy, card, board, and speed games online with friends in real-time.

---

## 🌟 Highlights

- **🕹️ Multi-Game Hub**: An all-in-one platform hosting classic and modern tabletop games: **Uno**, **Matiks** (mental math), **Ludo**, and **Chess**.
- **⚡ Blazing Fast Monorepo**: Orchestrated with [Turborepo](https://turbo.build/repo) and powered by [Bun](https://bun.sh) package manager and runtime.
- **🧠 Extensible Game Engine**: Modular game engine architecture (`@repo/game-engine`) with pluggable rule sets, state machines, turn controllers, and room managers.
- **🔐 Secure Authentication & Session Management**: Express 5 backend with JWT tokens, password hashing via bcrypt, device/IP tracking, and granular session revocation.
- **🗄️ End-to-End Type Safety**: PostgreSQL schema modeling and migrations with [Drizzle ORM](https://orm.drizzle.team) and [Zod](https://zod.dev) validations.
- **⚡ In-Memory Caching & Realtime Ready**: Namespaced Redis client wrapper (`@repo/common`) for fast session validation, match states, and pub/sub room broadcasts.
- **🎨 Next-Gen Web Interface**: [Next.js 16](https://nextjs.org/) App Router and [React 19](https://react.dev/) frontend.

---

## 🎲 Featured Games Suite

| Game          | Category    | Description                                                                                                                     | Players |
| :------------ | :---------- | :------------------------------------------------------------------------------------------------------------------------------ | :-----: |
| **🃏 Uno**    | Card Game   | Fast-paced card game with colors, numbers, and action cards (Skip, Reverse, +2, Wild, +4).                                      |   2–8   |
| **🧮 Matiks** | Mental Math | High-speed mental arithmetic showdown. Solve rapid equations, build combo streaks, and outscore opponents before time runs out. |   1–4   |
| **🎲 Ludo**   | Board Game  | The classic cross-and-circle board game. Roll dice, deploy tokens, capture rivals, and race your 4 pieces home safely.          |   2–4   |
| **♟️ Chess**  | Strategy    | Timed competitive chess with move validation, check/checkmate detection, and clocks.                                            |    2    |

---

## 📁 Repository Structure

```text
Zuno/
├── apps/
│   ├── backend/               # Express 5 REST API & Game Server (Bun runtime)
│   │   ├── src/
│   │   │   ├── config/        # Environment and app configuration
│   │   │   ├── errors/        # Typed custom API errors
│   │   │   ├── middlewares/   # Auth and error handling middlewares
│   │   │   ├── modules/
│   │   │   │   ├── auth/      # Auth handlers, repository, router, and service
│   │   │   │   └── users/     # User and profile handlers, repository, and service
│   │   │   └── utils/         # Helpers and session context
│   │   └── package.json
│   │
│   └── web/                   # Next.js 16 + React 19 Frontend Client
│       ├── app/               # Next.js App Router (pages, layouts, styles)
│       └── package.json
│
├── packages/
│   ├── common/                # Shared utilities, Redis client wrapper, Zod schemas
│   ├── db/                    # Drizzle ORM schema, PostgreSQL client, and migrations
│   ├── game-engine/           # Multi-game engine (Uno, Matiks, Ludo, Chess logic)
│   │   ├── src/
│   │   │   └── index.ts       # GameManager and game state controllers
│   ├── ui/                    # Shared React UI component library
│   ├── eslint-config/         # Shared ESLint configuration presets
│   └── typescript-config/     # Base tsconfig presets across workspaces
│
├── turbo.json                 # Turborepo task pipeline configuration
├── bun.lock                   # Bun lockfile
└── package.json               # Root workspace configuration
```

---

## 🛠️ Tech Stack

| Layer                         | Technology                                                                                                                            |
| :---------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
| **Runtime & Package Manager** | [Bun](https://bun.sh/) (`>= 1.3`)                                                                                                     |
| **Monorepo Engine**           | [Turborepo](https://turbo.build/repo)                                                                                                 |
| **Frontend**                  | [Next.js 16](https://nextjs.org/), [React 19](https://react.dev/), Vanilla CSS / CSS Modules                                          |
| **Backend**                   | [Express 5](https://expressjs.com/), TypeScript, Helmet, Morgan, CORS                                                                 |
| **Game Engine**               | Pure TypeScript state machines & rule engines (`@repo/game-engine`)                                                                   |
| **Database & ORM**            | [PostgreSQL](https://www.postgresql.org/), [Drizzle ORM](https://orm.drizzle.team/)                                                   |
| **Cache & State Store**       | [Redis](https://redis.io/) (via [ioredis](https://github.com/redis/ioredis))                                                          |
| **Validation & Security**     | [Zod](https://zod.dev/), [bcryptjs](https://github.com/dcodeIO/bcrypt.js), [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have installed:

- [Bun](https://bun.sh/) (`v1.3.14` or higher recommended)
- [Node.js](https://nodejs.org/) (`>= 24`)
- [PostgreSQL](https://www.postgresql.org/) (running locally or via cloud/Docker)
- [Redis](https://redis.io/) (running locally or via cloud/Docker)

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
# Run migrations from within packages/db or via turbo
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

---

## 📜 Monorepo Scripts

Run these commands from the root directory:

| Command               | Description                                                |
| :-------------------- | :--------------------------------------------------------- |
| `bun run dev`         | Start development servers for all apps (`web` & `backend`) |
| `bun run build`       | Build all apps and packages                                |
| `bun run lint`        | Run ESLint across all projects                             |
| `bun run check-types` | Run TypeScript type checks across all workspaces           |
| `bun run format`      | Format files with Prettier                                 |

### Filtering Tasks

Run commands for a single app or package using `--filter`:

```bash
# Run only backend in dev mode
bun exec turbo dev --filter=backend

# Run only web in dev mode
bun exec turbo dev --filter=web

# Typecheck only game-engine
bun exec turbo check-types --filter=@repo/game-engine
```

---

## 🔌 API Endpoints (Backend)

Base path: `/api/v1`

### Authentication (`/auth`)

| Method   | Endpoint           | Description                                     | Auth Required |
| :------- | :----------------- | :---------------------------------------------- | :-----------: |
| `POST`   | `/auth/register`   | Register a new user                             |      No       |
| `POST`   | `/auth/login`      | Log in and receive access token & session       |      No       |
| `DELETE` | `/auth/logout`     | Revoke current active session                   |      Yes      |
| `DELETE` | `/auth/logout-all` | Revoke all active sessions for user             |      Yes      |
| `GET`    | `/auth/sessions`   | List all active sessions with device/IP details |      Yes      |

### Users & Profiles (`/users`)

| Method | Endpoint         | Description                             | Auth Required |
| :----- | :--------------- | :-------------------------------------- | :-----------: |
| `GET`  | `/users`         | Get paginated list of users             |      Yes      |
| `GET`  | `/users/me`      | Fetch authenticated user information    |      Yes      |
| `GET`  | `/users/profile` | Fetch user profile (bio, country, etc.) |      Yes      |

---

## 🧭 Game Engine & Roadmap

- [x] **Monorepo Architecture**: Turborepo workspace setup with Bun, TypeScript, and shared tooling
- [x] **Authentication & Sessions**: Full JWT auth flow, session tracking, and device fingerprints
- [x] **Database & Caching Layer**: PostgreSQL schemas with Drizzle ORM and Redis client wrapper
- [ ] **Multi-Game Engine Core (`@repo/game-engine`)**:
  - [ ] **Uno Engine**: Card decks, turn rotation, color selection, action cards (+2, Skip, Reverse, Wild, Wild +4)
  - [ ] **Matiks Engine**: Mental math equation generation (adaptive difficulty), response validation, timer streaks & scoring
  - [ ] **Ludo Engine**: 4-player board coordinates, dice rolls, safe squares, token collisions/captures, and home runs
  - [ ] **Chess Engine**: Board state, FEN notation, legal move generator, check/checkmate detection, and clocks
- [ ] **Multiplayer & Networking**: Real-time room lobbies, matchmaking, and WebSocket state synchronization
- [ ] **Web Application UI**:
  - [ ] Game lobby browser and friend invitations
  - [ ] Responsive game boards with micro-animations and sound effects
- [ ] **Leaderboards & Player Stats**: Elo rating, win/loss history, and game-specific achievements

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
