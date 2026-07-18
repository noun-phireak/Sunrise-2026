# 99 — All-in-one

## What it does
A single **realistic multi-service stack** that combines the key features from
the whole lab into one working system. Use it as the capstone / summary.

```
        host :8080
            │
        ┌───▼───┐   proxies /api/   ┌───────┐
        │  web  │ ────────────────► │  api  │ (built from ./api)
        │ nginx │                   └───┬───┘
        └───────┘        frontend       │ backend
                                    ┌────┴────┐
                                ┌───▼──┐   ┌──▼────┐
                                │  db  │   │ cache │
                                │ pg16 │   │ redis │
                                └──────┘   └───────┘
```

## Features used
`services` · `image` · `build` (+args) · `ports` · `environment` · `env_file` ·
`volumes` (named + bind) · `networks` (frontend/backend split) · `depends_on`
(`service_healthy`) · `healthcheck` · `restart` · `entrypoint`/`command` ·
`profiles` (optional `seed`) · anchors (`x-defaults`) · `secrets`.

## Run
```bash
docker compose up --build -d
docker compose ps            # watch db -> api -> web become (healthy)
```

## Test it
```bash
curl -s http://localhost:8080         # the nginx homepage
curl -s http://localhost:8080/api/    # proxied to the api service
docker compose logs api               # startup banner (secret is masked)
```

## Expected api log
```
==============================================
 Sunrise Stack v1.0 (api)
 DB host:    db
 Redis host: cache
 DB secret:  ***************
 Serving:    http://localhost:8080
==============================================
```

## Run the optional seed job (profiles)
```bash
docker compose --profile setup run --rm seed
# -> a row: seeded = 1
```

## Isolation check
```bash
# db/cache are on the backend net only — NOT published to the host:
docker compose ps            # no host port for db or cache
```

## Clean up
```bash
docker compose down          # keep the db-data volume
docker compose down -v --rmi local   # also remove the volume & built api image
```
