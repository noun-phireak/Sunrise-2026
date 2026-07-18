# 03 — Host network

## What it does
`--network host` removes the network isolation between the container and the
host: the container **shares the host's network stack** directly. No virtual
bridge, no NAT, and **no need to publish ports** — a server listening on `:80`
inside the container is reachable on the **host's** `:80` immediately.

## Syntax
```bash
docker run --network host <image>
```

## Notes
- **No `-p` needed** — the container uses host ports directly.
- **Fastest** networking (no NAT overhead); used for high-throughput / latency-
  sensitive services.
- **Trade-offs:** no isolation, and **port conflicts** with the host are possible
  (only one thing can own `:80`).
- **⚠️ macOS / Windows (Docker Desktop):** the "host" is the small **Linux VM**
  Docker runs inside, **not your Mac**. Host networking on Desktop is limited and
  must be enabled in *Settings → Resources → Network*. The behavior below is for
  **native Linux**; on a Mac, prefer bridge + `-p` for predictable results.

## Run (native Linux)
```bash
docker run -d --network host --name host-web nginx:alpine

# No -p was used, yet nginx answers on the HOST's port 80:
curl -s http://localhost:80 | grep -o '<title>.*</title>'
```

## Expected output (Linux)
```
<title>Welcome to nginx!</title>
```

## Try it
```bash
# The container sees the host's interfaces directly (not a private 172.x IP):
docker run --rm --network host alpine ip -o addr show | awk '{print $2, $4}'
docker rm -f host-web 2>/dev/null
```
