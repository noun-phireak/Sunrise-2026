# 07 — volumes

## What it does
`volumes:` attach storage to a container so data can **persist** or be **shared
with the host**. Two flavours:

- **Named volume** — managed by Docker, lives beyond the container. Best for
  databases and app data.
- **Bind mount** — maps a host folder into the container. Best for live-editing
  source/config during development.

## Syntax
```yaml
services:
  db:
    volumes:
      - data:/data                # named volume  (name:path)
      - ./site:/usr/share/nginx/html:ro   # bind mount (./host:container[:ro])

volumes:
  data:                           # every named volume must be declared here
```

## Notes
- Named volumes **survive `docker compose down`**. Remove them with
  `down -v` or `docker volume rm`.
- Bind mounts start with `.` or `/` (a real path); named volumes are a bare name.
- `:ro` = read-only; `:rw` (default) = read-write.
- Bind mounts reflect host edits **instantly** — no rebuild needed.

## Run
```bash
docker compose up -d
docker compose logs writer          # shows growing timestamps each run
curl -s http://localhost:8080       # served from ./site (bind mount)
```

## Expected output (run `up` twice)
```
writer-1  | ---- /data/log.txt ----
writer-1  | Sat Jul 18 ... 2026
writer-1  | Sat Jul 18 ... 2026
```

## Try it
```bash
docker volume ls | grep 07-volumes     # the named volume
docker compose down                    # data volume PERSISTS
docker compose down -v                 # data volume REMOVED
```
