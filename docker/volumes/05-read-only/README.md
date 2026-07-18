# 05 — Read-only mounts & read-only root

## What it does
Any mount can be made **read-only** so the container can look but not touch —
a common security hardening. You can also make the container's **whole root
filesystem** read-only and hand it a small writable `tmpfs` for the few paths
that must be writable.

## Syntax
```bash
docker run -v data:/data:ro <image>                 # read-only volume
docker run --mount type=bind,src=...,dst=...,readonly <image>
docker run --read-only --tmpfs /tmp <image>         # read-only root + writable /tmp
```

## Notes
- `:ro` on a mount = the container **cannot modify** those files (great for config).
- `--read-only` locks the **entire root filesystem** — writes fail everywhere
  except mounts you explicitly allow.
- Pattern: `--read-only` **plus** a `tmpfs` for `/tmp` (or a volume for data) gives
  a container that can run but can't be tampered with on disk.

## Run — writing to a read-only mount fails
```bash
docker volume create ro-demo
docker run --rm -v ro-demo:/data:ro alpine sh -c 'echo hi > /data/x.txt'
```

## Expected output
```
sh: can't create /data/x.txt: Read-only file system
```

## Try it — read-only root, writable tmpfs
```bash
docker run --rm --read-only --tmpfs /tmp alpine sh -c '
  echo "root fs:"; (echo x > /root.txt && echo "  wrote (unexpected)") || echo "  BLOCKED (read-only root)"
  echo "tmpfs /tmp:"; echo x > /tmp/ok.txt && echo "  wrote OK (writable tmpfs)"'
docker volume rm ro-demo
```
Expected: root write is **BLOCKED**, `/tmp` write **succeeds**.
