# 01 — Default bridge network

## What it does
Every container, unless told otherwise, joins Docker's **default `bridge`**
network. It gets a private IP, can reach the internet through NAT, and reaches
other containers **by IP address** — but **not by name** (the default bridge has
**no built-in DNS**). That missing DNS is the reason you almost always want a
*user-defined* bridge instead (see `02`).

## Syntax
```bash
docker run <image>                       # default: joins the `bridge` network
docker run --network bridge <image>      # the same thing, spelled out
```

## Notes
- **Default driver** — this is what you get with no `--network` flag.
- Containers get IPs like `172.17.0.x` and talk to the host via NAT.
- To reach a container **from the host**, you must **publish a port** (`-p 8080:80`).
- **No container DNS here** — the name of another container does **not** resolve
  to it on the default bridge. (The old `--link` flag patched this but is deprecated.)

## Run — same network, but the name doesn't reach the container
```bash
docker run -d --name c1 alpine sleep 600
docker run -d --name c2 alpine sleep 600

# On the default bridge the IP is nested under .Networks.bridge:
C1_IP=$(docker inspect -f '{{.NetworkSettings.Networks.bridge.IPAddress}}' c1)
echo "c1 is at $C1_IP"

docker exec c2 ping -c 2 "$C1_IP"     # by IP   -> reaches the container
docker exec c2 ping -c 2 c1           # by name -> does NOT reach the container
```

## Expected output
```
c1 is at 172.17.0.2
64 bytes from 172.17.0.2: seq=0 ttl=64 time=0.1 ms      <- by IP: reaches c1
```
The **by-name** ping never reaches `c1`. The exact symptom depends on your host's
DNS:
```
ping: bad address 'c1'                 # clean networks (name returns NXDOMAIN)
# ── or ──
PING c1 (203.0.113.5): 56 data bytes   # some ISPs/routers hijack unknown names,
1 packets transmitted, 0 received, 100% packet loss   # so it "resolves" to a
                                       # bogus public IP and just times out
```
Either way the name never maps to the **container** — the default bridge has no
container DNS. A **user-defined** bridge (`02`) fixes exactly this.

## Try it
```bash
docker network inspect bridge         # see both containers attached
docker rm -f c1 c2
```
