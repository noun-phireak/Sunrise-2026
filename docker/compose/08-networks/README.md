# 08 — networks

## What it does
Compose puts your services on a shared **network** and gives each one a DNS
name equal to its **service name**. That's how services talk to each other —
`http://api:5678` just works, with **no published ports and no IP addresses**.

## Syntax
```yaml
services:
  api:
    networks: [backend]
  client:
    networks: [backend]

networks:
  backend:                 # a custom bridge network
```

## Notes
- You get a `default` network for free — you only declare `networks:` to
  **segment** traffic (e.g. a `frontend` and a `backend` net).
- Reach a service at `http://<service-name>:<container-port>` — the *container*
  port, not any host `ports:` mapping.
- Only `ports:` exposes a service to the **host**; internal traffic never needs it.
- Services on **different** networks cannot see each other — handy for isolation
  (e.g. keep the database off the frontend network).

## Run
```bash
docker compose up
```

## Expected output
```
client-1  | hello from the api service
client-1 exited with code 0
```

## Try it
```bash
docker compose up -d api
docker compose exec api nslookup client   # DNS resolution between services
docker network ls | grep 08-networks
docker compose down
```
