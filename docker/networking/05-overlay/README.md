# 05 — Overlay network (multi-host)

## What it does
An **overlay** network spans **multiple Docker hosts**, letting containers on
*different machines* talk as if they were on one LAN. Docker builds a virtual
network on top of the real one (VXLAN tunnels). This is the driver behind
**Docker Swarm** clusters (and conceptually what Kubernetes does too).

## Syntax
```bash
docker swarm init                                   # overlay requires swarm mode
docker network create -d overlay --attachable my-overlay
docker run --network my-overlay <image>             # --attachable allows plain `run`
```

## Notes
- **Requires Swarm mode** (`docker swarm init`) — overlay is not available to
  standalone `docker run` until a swarm exists.
- In production it joins **many nodes**; you can still demo it on **one node**.
- `--attachable` lets ordinary `docker run` containers join (otherwise only
  Swarm *services* can).
- Supports **built-in DNS** (by name, like a user-defined bridge) and optional
  **encryption** (`--opt encrypted`) for traffic between hosts.
- Bridge = one host; **overlay = many hosts**. That's the key difference.

## Run (single-node demo)
```bash
docker swarm init 2>/dev/null || true
docker network create -d overlay --attachable my-overlay

docker run -d  --network my-overlay --name svc-a alpine sleep 600
docker run -d  --network my-overlay --name svc-b alpine sleep 600

docker exec svc-b ping -c 2 svc-a        # DNS by name works across the overlay
```

## Expected output
```
64 bytes from svc-a (10.0.1.3): seq=0 ttl=64 time=0.2 ms
```

## Clean up
```bash
docker rm -f svc-a svc-b
docker network rm my-overlay
docker swarm leave --force        # exit swarm mode when you're done
```
