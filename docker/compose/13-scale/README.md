# 13 — scale / replicas

## What it does
Run **several containers of the same service** to handle more load. Compose
names them `service-1`, `service-2`, … and load-balances DNS across them.

## Two ways to scale
```yaml
services:
  worker:
    deploy:
      replicas: 3        # declarative — applied by `docker compose up`
```
```bash
docker compose up -d --scale worker=3   # imperative — flag at runtime
```

## Notes
- A scaled service **must not** publish a fixed host port (`"8080:80"`) — the
  replicas would collide. Use a range `"8080-8082:80"`, a random port `"80"`,
  or put a reverse proxy in front.
- Plain `docker compose` honours `deploy.replicas`; most other `deploy:` keys
  (CPU/memory limits, placement) only apply under **Swarm** (`docker stack`).
- Requests to `http://worker:PORT` are round-robined across replicas via DNS.

## Run
```bash
docker compose up -d
docker compose ps          # three worker containers
```

## Expected output
```
NAME                 IMAGE          STATUS
13-scale-worker-1    alpine:3.20    Up 3 seconds
13-scale-worker-2    alpine:3.20    Up 3 seconds
13-scale-worker-3    alpine:3.20    Up 3 seconds
```

## Try it
```bash
docker compose up -d --scale worker=5   # scale up live
docker compose logs worker              # each container has a unique $HOSTNAME
docker compose down
```
