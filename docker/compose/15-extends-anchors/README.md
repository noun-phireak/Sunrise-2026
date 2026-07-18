# 15 — extends & anchors (DRY)

## What it does
Two techniques to avoid copy-pasting the same config across services:

- **YAML anchors** (`&name` / `*name`) + merge (`<<:`) — reuse a block **within
  one file**.
- **`extends`** — inherit a service's definition, optionally **from another file**.

## Syntax
```yaml
x-common: &common          # x-* = extension field (ignored by Compose)
  image: alpine:3.20
  restart: on-failure

services:
  api:
    <<: *common            # merge the anchored map in
    command: echo hi

  logger:
    extends:
      file: common.yaml
      service: base-logger
```

## Notes
- `x-` prefixed top-level keys are **extension fields** — Compose ignores them,
  so they're the idiomatic home for anchors.
- `<<:` merges a mapping; keys you define locally **override** the anchor.
- Anchors are pure YAML (single file). `extends` is a Compose feature and can
  reach into **other files** — better for sharing across projects.
- `extends` does **not** merge `volumes_from` or `depends_on` (to avoid surprises).

## Run
```bash
docker compose up
```

## Expected output
```
api-1     | api — inherits image, restart, STAGE via anchor
worker-1  | worker — same defaults, extra env
logger-1  | logger — extended from common.yaml
```

## Try it
```bash
docker compose config        # see the fully-expanded result (anchors resolved)
docker compose down
```
