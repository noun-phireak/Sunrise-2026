# 06 — env_file

## What it does
`env_file:` loads environment variables into a container **from a file**,
keeping config out of `compose.yaml`. Ideal when you have many variables.

## Syntax
```yaml
services:
  app:
    env_file:
      - app.env          # one or more files, later files win
```

## Two different files — don't confuse them
| File | Read by | Purpose |
|------|---------|---------|
| **`env_file:` target** (e.g. `app.env`) | the **container** | vars available to the running process |
| **`.env`** (special, automatic) | **Compose itself** | interpolates `${VARS}` inside `compose.yaml` |

- `.env` fills in `${VARS}` in the compose file — it does **not** get injected
  into containers unless you also reference those vars.
- Precedence (low→high): image `ENV` → `env_file` → `environment` → shell `-e`.
- **Never commit real secrets.** Add `*.env` / `.env` to `.gitignore`.

## Run
```bash
docker compose up
```

## Expected output
```
app-1  | Sunrise API is listening on port 8080 (production)
```

## Try it
```bash
docker compose config        # note the project name comes from .env
docker compose run --rm app env | grep -E 'APP_NAME|PORT|STAGE'
docker compose down
```
