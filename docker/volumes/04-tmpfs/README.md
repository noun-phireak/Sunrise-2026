# 04 — tmpfs mount (temporary / in-memory)

## What it does
A **tmpfs mount** lives in the host's **RAM**, never on disk. It's **fast** and
**ephemeral** — the moment the container stops, the data is **gone**. Use it for
scratch files, caches, and sensitive temporary data (tokens, secrets) you don't
want persisted.

## Syntax
```bash
docker run --tmpfs /path <image>                        # short form
docker run --mount type=tmpfs,dst=/path,tmpfs-size=64m <image>   # explicit + size cap
```

## Notes
- **In memory only** — nothing is ever written to disk. Stops = data vanishes.
- The opposite of a named volume (`01`): named = **persist**, tmpfs = **disappear**.
- **Linux containers only** (not supported on Windows containers).
- Great for secrets and scratch space; cap the size with `tmpfs-size` so it can't
  eat all your RAM.

## Run
```bash
docker run --rm --tmpfs /cache alpine sh -c '
  echo "scratch data" > /cache/tmp.txt
  echo "--- file exists WHILE running: ---"
  cat /cache/tmp.txt
  echo "--- and it is mounted as tmpfs (RAM): ---"
  mount | grep /cache'
```

## Expected output
```
--- file exists WHILE running: ---
scratch data
--- and it is mounted as tmpfs (RAM): ---
tmpfs on /cache type tmpfs (rw,...)
```
When this container exits, `/cache` and everything in it is **gone** — it was
never on disk.

## Try it
```bash
# Prove it never touches disk: a new container sees an empty /cache.
docker run --rm --tmpfs /cache alpine ls -la /cache
```
