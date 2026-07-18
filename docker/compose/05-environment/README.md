# 05 — environment

## What it does
`environment:` sets **environment variables inside the container** — the
Compose equivalent of `docker run -e`. Use it for configuration: ports, feature
flags, connection strings.

## Syntax
```yaml
services:
  app:
    environment:
      APP_NAME: "Sunrise Demo"     # map form (key: value)
    # --- or list form: ---
    environment:
      - APP_NAME=Sunrise Demo
      - PASS_THROUGH               # no value = take it from your host env
```

## Notes
- **The `$` trap:** Compose interpolates `$VAR`/`${VAR}` from *your host shell*
  **before** starting the container. To pass a literal `$` into the container,
  **double it**: `$$GREETING`. This is the #1 Compose gotcha.
- For many variables or secrets, prefer an **env file** (see `06-env_file`).
- Values here **override** those baked into the image with `ENV`.

## Run
```bash
docker compose up
```

## Expected output
```
app-1  | Hello student — running Sunrise Demo
```

## Try it
```bash
# Override at up-time via your host shell (single $ is interpolated by Compose):
GREETING="Good morning" docker compose up   # only if compose.yaml used ${GREETING}
docker compose run --rm app env             # dump all env vars
docker compose down
```
