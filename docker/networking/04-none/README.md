# 04 — None (no network)

## What it does
`--network none` gives the container **no networking at all** — only its own
loopback (`lo`). No `eth0`, no internet, no talking to other containers. Maximum
isolation.

## Syntax
```bash
docker run --network none <image>
```

## Notes
- The container has **only** the `lo` loopback interface — nothing else.
- Use it for **untrusted code**, offline batch/compute jobs, or anything that
  should provably have **no network access**.
- You can attach a network later if needed: `docker network connect <net> <container>`.

## Run — prove there is no external network
```bash
# Only loopback exists:
docker run --rm --network none alpine ip -o addr show

# And the internet is unreachable:
docker run --rm --network none alpine ping -c 2 8.8.8.8
```

## Expected output
```
1: lo    inet 127.0.0.1/8 scope host lo        <- loopback ONLY, no eth0
ping: sendto: Network unreachable               <- no route anywhere
```

## Try it
```bash
# Compare against a normal container, which HAS eth0 and internet:
docker run --rm alpine ip -o addr show | grep eth0
```
