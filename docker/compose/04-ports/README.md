# 04 — ports

## What it does
`ports:` **publishes** a container's port to the host machine so you can reach
the service from your browser or `curl`. The format is `"HOST:CONTAINER"`.

## Syntax
```yaml
services:
  web:
    image: nginx:alpine
    ports:
      - "8080:80"        # host 8080 -> container 80
      - "127.0.0.1:9000:9000"   # bind to localhost only
      - "3000"           # random host port -> container 3000
```

## Notes
- **`ports` vs `expose`:** `ports` opens the port to the *host*; `expose` only
  makes it reachable by *other services* on the Compose network (no host access).
- Left side = host, right side = container. A common bug is swapping them.
- Services talk to **each other** by service name + container port — they do
  **not** need `ports` for internal traffic (see `08-networks`).

## Run
```bash
docker compose up -d
```

## Expected output
```bash
curl -s http://localhost:8080 | head -n 4
# <!DOCTYPE html>
# <html>
# <head>
# <title>Welcome to nginx!</title>
```

## Try it
```bash
docker compose ps            # PORTS column shows 0.0.0.0:8080->80/tcp
docker compose down
```
