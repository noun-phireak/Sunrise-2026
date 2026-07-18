# 12 — command & entrypoint

## What it does
`command:` and `entrypoint:` **override** the `CMD` and `ENTRYPOINT` baked into
the image — without rebuilding it. Same concepts as the Dockerfile lab's `09-CMD`
and `10-ENTRYPOINT`, but set per-service in Compose.

## Syntax
```yaml
services:
  app:
    entrypoint: ["sh", "-c"]   # the fixed executable
    command: ["echo hi"]       # its arguments
```

## Notes
- Use **exec form** (JSON array) so signals (SIGTERM) reach your process
  cleanly for graceful shutdown.
- `command:` alone overrides the image `CMD`. `entrypoint:` overrides `ENTRYPOINT`
  **and clears the image's `CMD`** — so usually set both together.
- Setting `entrypoint: []` (empty) *removes* the image's entrypoint entirely.
- Shell form (`command: echo hi`) also works but runs via `/bin/sh -c`.

## Run
```bash
docker compose up
```

## Expected output
```
default-cmd-1   | command: overrides the image's default CMD
custom-entry-1  | entrypoint + command working together
```

## Try it
```bash
docker compose run --rm default-cmd echo "ad-hoc override"
docker compose down
```
