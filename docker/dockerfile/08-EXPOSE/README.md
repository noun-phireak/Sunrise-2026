# 08 — EXPOSE

## What it does
`EXPOSE` **documents** which port(s) the container listens on. It is metadata —
it does **not** actually publish or open the port to your host.

## Syntax
```dockerfile
EXPOSE <port>[/<protocol>]     # protocol defaults to tcp
EXPOSE 80 443
EXPOSE 53/udp
```

## Notes
- To actually reach the port you must **publish** it at run time:
  - `-p 8080:80` → map host 8080 to container 80
  - `-P` (capital) → publish **all** EXPOSEd ports to random host ports
- `EXPOSE` is helpful documentation for anyone using your image and enables `-P`.
- Common ports: 80 (HTTP), 443 (HTTPS), 5432 (Postgres), 3306 (MySQL).

## Build
```bash
docker build -t lab-expose .
```

## Run
```bash
# Publish container port 80 to host port 8080:
docker run --rm -d -p 8080:80 --name lab-expose lab-expose
```

## Test it
```bash
curl http://localhost:8080
```

## Expected output
```
<h1>EXPOSE lab works!</h1>
```

## Stop it
```bash
docker rm -f lab-expose
```

## Try it
```bash
# Use -P to auto-publish EXPOSEd ports, then see the mapping:
docker run --rm -d -P --name lab-expose lab-expose
docker port lab-expose      # shows 80/tcp -> 0.0.0.0:<random>
docker rm -f lab-expose
```
