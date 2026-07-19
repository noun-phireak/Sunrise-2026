# Assignment: Dockerize the Sunrise POS System

## Goal

This repository contains a working Point-of-Sale (POS) application split into two
apps and backed by a database. Right now it can only be run by installing
everything by hand on your machine.

**Your job: containerize the whole thing so a teammate can start it with a single
command.** You will write the `Dockerfile`s and a `docker-compose.yml`. You are
**not** required to change the application source code.

---

## What's in the box

```
apps/
├── api/    NestJS backend  (REST API)
└── web/    Vue 3 + Vite frontend (single-page app)
```

### Backend — `api/`
- **Runtime:** Node.js 20
- **Framework:** NestJS 11 with TypeORM
- **Database:** PostgreSQL
- **Listens on:** port `3000` (or `PORT` env var)
- **API docs:** Swagger UI at `http://<host>:3000/api/docs`
- **Important:** the database schema is created by **migrations** — the app does
  not create tables on its own. On startup it also **seeds** reference data and an
  admin user, but seeding only works *after* the tables exist.

Useful scripts (see `api/package.json`):
| Script | What it does |
|---|---|
| `npm run start:dev` | Start the API in watch mode (development) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run start:prod` | Run the compiled app (`node dist/main`) |
| `npm run migration:run` | Apply DB migrations (development, TypeScript) |
| `npm run migration:run:prod` | Apply DB migrations against the compiled build |

The API reads its configuration from environment variables — see
`api/.env.template` for the full list (database connection, `JWT_SECRET`, etc.).

### Frontend — `web/`
- **Runtime:** Node.js 20+
- **Framework:** Vue 3 + Vite + Vuetify (uses `vue-router` in HTML5 history mode)
- **Dev server port:** `5173`
- **Talks to the API** via the `VITE_API_URL` environment variable.

Useful scripts (see `web/package.json`):
| Script | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build-only` | Produce a static production build in `dist/` |

---

## How the app is meant to run (the target)

When you're done, running your compose file should give:

| Component | Reachable at | Notes |
|---|---|---|
| Web frontend | http://localhost:5173 | Loads in the browser |
| Backend API | http://localhost:3000 | e.g. `GET /categories` returns JSON |
| API docs | http://localhost:3000/api/docs | Swagger UI |
| PostgreSQL | (your choice) | Persists data between restarts |

---

## Your tasks

1. **Write a `Dockerfile` for the backend (`api/`)** so the API runs in a container.
2. **Write a `Dockerfile` for the frontend (`web/`)** so the web app runs in a container.
3. **Write a `docker-compose.yml`** (in the `apps/` folder) that starts three services:
   - a **PostgreSQL** database,
   - the **api**,
   - the **web** app,
   and wires them together so the whole system works with one command:
   ```bash
   docker compose up --build
   ```

## Requirements

Your solution must satisfy all of these:

- [ ] `docker compose up --build` starts **all three** services from a clean state
      (no manual steps in between).
- [ ] The **api connects to the database** container (not to `localhost`).
- [ ] **Database tables exist and are seeded** after startup — i.e. migrations run
      as part of bringing the stack up. Think about *ordering*: the database must be
      ready before the api tries to migrate.
- [ ] The **web app can call the api** successfully from the browser
      (check the network tab — requests to the API should return `200`).
- [ ] **Database data survives** a `docker compose down` followed by
      `docker compose up` (use a named volume).
- [ ] All configuration (DB credentials, `JWT_SECRET`, `VITE_API_URL`) is passed via
      **environment variables / compose**, not hard-coded inside images.
- [ ] Images do **not** bake in host `node_modules` (use a `.dockerignore`).

## Things to figure out (hints, not answers)

- The database container needs a way to tell others it's *ready to accept
  connections* before the api runs migrations. Look into **healthchecks** and
  `depends_on`.
- Migrations need to run **before** the app is usable. Where should that command
  live — in the Dockerfile, or in the compose `command`?
- `VITE_API_URL` is read by the browser, which runs on your **host machine**, not
  inside the docker network. What hostname/port should it point to?
- For fast local development you probably want **hot reload** (bind-mount the
  source). For a production image you'd want a **small, built** image instead.
  Decide which you're building.
- The frontend uses history-mode routing. If you serve a production build with a
  web server, deep links like `/products` must fall back to `index.html`.

---

## How your work will be graded

Your instructor will:

1. Clone your submission fresh.
2. Run `docker compose up --build`.
3. Open `http://localhost:5173` and use the app.
4. Hit `http://localhost:3000/api/docs` and call `GET /categories`.
5. Run `docker compose down` then `docker compose up` again and confirm the data
   is still there.

### Scoring guide

| Points | Criteria |
|---|---|
| 30 | Backend image builds and the API starts |
| 20 | Frontend image builds and the app loads |
| 20 | `docker compose up` brings up all three services correctly wired |
| 15 | Migrations run automatically and DB is seeded (correct startup ordering) |
| 10 | Data persists across restarts (named volume) |
| 5  | Clean setup: `.dockerignore`, env-based config, no secrets hard-coded |
| +10 (bonus) | Multi-stage production build for the web app served by a real web server (e.g. nginx) with SPA fallback |
| +5 (bonus)  | Separate dev vs. production compose / Dockerfiles |

---

## Submission

Commit your `Dockerfile`(s), `docker-compose.yml`, and any `.dockerignore` /
`.env.example` files. Include a short note in your PR describing:
- how to run your solution,
- any environment variables that need to be set,
- anything you'd improve with more time.

Good luck!
