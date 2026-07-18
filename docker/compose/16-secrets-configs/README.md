# 16 — secrets & configs

## What it does
`secrets:` and `configs:` mount sensitive or bulky data into a container **as
files** rather than baking them into the image or leaking them via `environment`.

- **secrets** → mounted read-only at `/run/secrets/<name>` (passwords, keys, certs).
- **configs** → mounted at a path you choose (config files, templates).

## Syntax
```yaml
services:
  app:
    secrets: [db_password]
    configs:
      - source: app_config
        target: /etc/app/config.json

secrets:
  db_password:
    file: ./db_password.txt
configs:
  app_config:
    file: ./app_config.json
```

## Notes
- **Why not `environment:`?** Env vars leak via `docker inspect`, `/proc`, crash
  logs, and child processes. A file at `/run/secrets/...` is read-only and less
  exposed.
- Secrets are mounted **read-only**; the default file mode is `0444`.
- In plain Compose, secrets come from a `file:` (or `environment:`). Docker
  **Swarm** adds an encrypted, cluster-managed secret store.
- **Never commit real secrets** — the `db_password.txt` here is a demo only.

## Run
```bash
docker compose up
```

## Expected output
```
app-1  | secret  -> s3cr3t-p@ssw0rd
app-1  | config  -> {"feature_flags": {"new_ui": true}, "max_connections": 25}
```

## Try it
```bash
docker compose run --rm app ls -l /run/secrets   # read-only mount
docker compose down
```
