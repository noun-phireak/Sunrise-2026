# 02 — image

## What it does
`image:` runs a **prebuilt image** pulled from a registry (Docker Hub by
default). This is the fastest way to add ready-made software — databases,
caches, proxies — to your stack.

## Syntax
```yaml
services:
  cache:
    image: redis:7-alpine          # repo:tag
    # image: ghcr.io/org/app:1.2   # a fully-qualified image from another registry
```

## Notes
- Always **pin a tag** (`redis:7-alpine`) — never rely on the default `:latest`,
  which drifts over time and breaks reproducibility.
- If the image isn't local, Compose pulls it on first `up`.
- `image:` and `build:` (see `03-build`) can be combined — `build` makes the
  image and `image` names/tags the result.

## Run
```bash
docker compose up -d
docker compose ps
```

## Expected output
```
NAME               IMAGE           STATUS         PORTS
02-image-cache-1   redis:7-alpine  Up 2 seconds   6379/tcp
```

## Try it
```bash
docker compose exec cache redis-cli ping     # -> PONG
docker compose pull                          # refresh the image
docker compose down
```
