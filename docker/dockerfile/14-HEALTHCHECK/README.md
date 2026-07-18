# 14 — HEALTHCHECK

## What it does
`HEALTHCHECK` tells Docker how to **test whether the container is working**.
Docker runs the command periodically and marks the container
`healthy` / `unhealthy`.

## Syntax
```dockerfile
HEALTHCHECK [options] CMD <command>
HEALTHCHECK NONE       # disable a healthcheck inherited from the base image
```

## Options
| Option | Meaning | Default |
|--------|---------|---------|
| `--interval` | time between checks | 30s |
| `--timeout` | max time for one check | 30s |
| `--start-period` | grace period at startup (failures don't count) | 0s |
| `--retries` | consecutive failures before `unhealthy` | 3 |

## Notes
- The check **command's exit code** decides health: `0` = healthy, `1` = unhealthy.
- Status appears in `docker ps` under `STATUS` and in `docker inspect`.
- Orchestrators (Compose, Swarm, Kubernetes) can restart or reroute based on it.
- Keep checks lightweight (they run repeatedly).

## Build
```bash
docker build -t lab-healthcheck .
```

## Run
```bash
docker run --rm -d --name lab-health lab-healthcheck
```

## Watch the status change
```bash
docker ps           # STATUS shows "health: starting" then "(healthy)"
```

## Expected output (after a few seconds)
```
CONTAINER ID   IMAGE              STATUS                   ...
xxxxxxxxxxxx   lab-healthcheck    Up 10 seconds (healthy)  ...
```

## Inspect the health log
```bash
docker inspect --format '{{json .State.Health}}' lab-health
```

## Clean up
```bash
docker rm -f lab-health
```
