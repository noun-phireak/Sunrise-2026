# 02 — User-defined bridge network

## What it does
A **network you create yourself** with `docker network create`. It behaves like
the default bridge **plus** it has **automatic DNS**: containers on it reach each
other **by container name**. This is the **recommended** way to connect
containers on one host.

## Syntax
```bash
docker network create <name>
docker run --network <name> --name web <image>
```

## Notes
- **Built-in DNS** — `ping web` / `curl http://web` just works (contrast with `01`).
- Better **isolation** — only containers you attach can see each other.
- You can attach/detach a running container: `docker network connect <net> <container>`.
- This is exactly what Docker Compose creates for you automatically (Compose lab `08`).

## Run — names resolve automatically
```bash
docker network create labnet

docker run -d --network labnet --name web   nginx:alpine
docker run -d --network labnet --name probe alpine sleep 600

docker exec probe ping -c 2 web        # by NAME -> works, thanks to DNS
docker exec probe wget -qO- http://web | grep -o '<title>.*</title>'
```

## Expected output
```
64 bytes from web (172.18.0.2): seq=0 ttl=64 time=0.1 ms
<title>Welcome to nginx!</title>
```

## Try it
```bash
# Isolation: a container on the DEFAULT bridge cannot resolve 'web':
docker run --rm alpine ping -c 2 web        # -> bad address 'web'

docker network inspect labnet
docker rm -f web probe
docker network rm labnet
```
