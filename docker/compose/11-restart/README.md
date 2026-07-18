# 11 — restart

## What it does
`restart` sets the container's **restart policy** — what Docker does when the
process exits or the Docker daemon restarts (e.g. after a reboot).

## Syntax
```yaml
services:
  app:
    restart: unless-stopped
```

## The four policies
| Policy | Restarts on crash? | Restarts on reboot? | Notes |
|--------|:---:|:---:|-------|
| `no` (default) | ✗ | ✗ | never restart |
| `on-failure` | ✓ (non-zero exit) | ✗ | add `:5` to cap attempts |
| `always` | ✓ | ✓ | restarts even after a manual `stop` (on daemon restart) |
| `unless-stopped` | ✓ | ✓ | like `always`, but respects a manual `stop` |

## Notes
- `unless-stopped` is the usual choice for long-running services.
- `restart` handles *process death*; it is **not** a healthcheck. A container
  can be "running" but broken — pair with `10-healthcheck`.
- The Compose-spec `deploy.restart_policy` is the Swarm equivalent; for plain
  `docker compose`, use the top-level `restart:` shown here.

## Run
```bash
docker compose up -d
docker compose ps          # watch `flaky` restart repeatedly
```

## Expected output
```
NAME                  STATUS
11-restart-flaky-1    Restarting (1) 2 seconds ago
11-restart-always-up-1  Up 5 seconds
```

## Try it
```bash
docker compose logs flaky      # repeated "starting... / crashing!" cycles
docker compose down
```
