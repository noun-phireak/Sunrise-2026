# 02 — Anonymous volume

## What it does
An **anonymous volume** is a named volume **without a name** — you give only the
container path, and Docker invents a long random ID for it. Same storage as a
named volume, but far harder to find and reuse.

## Syntax
```bash
docker run -v /path/in/container <image>       # note: NO name before the colon
```

## Notes
- Docker auto-creates these when an **image declares `VOLUME`** (Dockerfile lab `11`)
  and you don't supply your own.
- The random ID (`d3f8a1…`) makes them **hard to reuse** — they usually become
  orphaned junk that eats disk.
- `docker run --rm` removes the container **and its anonymous volumes**.
  Without `--rm`, use `docker rm -v <container>` to clean them up.
- **Prefer a named volume** whenever you care about the data.

## Run
```bash
# Two runs each create a DIFFERENT anonymous volume — data is NOT shared:
docker run --name a1 -v /data alpine sh -c 'echo hi > /data/f.txt'
docker run --name a2 -v /data alpine cat /data/f.txt   # empty! different volume
```

## Expected output
```
cat: can't open '/data/f.txt': No such file or directory
```
Each anonymous volume is separate — unlike the named volume in `01`.

## Try it
```bash
docker volume ls                     # note the long random-hash volume names
docker rm -v a1 a2                   # remove containers + their anon volumes
docker volume prune                  # sweep up any leftover anonymous volumes
```
