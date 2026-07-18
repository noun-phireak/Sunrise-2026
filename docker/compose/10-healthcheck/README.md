# 10 — healthcheck

## What it does
`healthcheck` defines a command Compose runs periodically to decide whether a
service is **healthy**. The result drives the `(healthy)`/`(unhealthy)` status
and enables `depends_on: condition: service_healthy` (see `09`).

## Syntax
```yaml
services:
  web:
    healthcheck:
      test: ["CMD", "wget", "-q", "-O", "/dev/null", "http://localhost:80/"]
      interval: 5s
      timeout: 3s
      retries: 3
      start_period: 5s
```

## Notes
- Exit code `0` = healthy, non-zero = unhealthy.
- `CMD` runs a binary directly; `CMD-SHELL` runs a string via the shell
  (handy for `||`, pipes, env vars).
- `start_period` gives a slow-booting app time to warm up before failures count.
- A Compose `healthcheck` **overrides** any `HEALTHCHECK` baked into the image.
- Set `test: ["NONE"]` to disable an image's built-in healthcheck.

## Run
```bash
docker compose up -d
docker compose ps          # watch STATUS go from (health: starting) -> (healthy)
```

## Expected output
```
NAME                    IMAGE         STATUS                    PORTS
10-healthcheck-web-1    nginx:alpine  Up 12 seconds (healthy)   0.0.0.0:8080->80/tcp
```

## Try it
```bash
docker inspect --format '{{json .State.Health}}' 10-healthcheck-web-1
docker compose down
```
