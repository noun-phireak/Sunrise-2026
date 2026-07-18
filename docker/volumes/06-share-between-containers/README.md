# 06 — Sharing a volume between containers

## What it does
Mount the **same named volume** into **two containers** and they share the same
files — one writes, the other reads. This is how sidecars, backups, and
producer/consumer patterns share data.

## Syntax
```bash
docker run -v shared:/data <imageA>
docker run -v shared:/data <imageB>          # same volume name = same storage
docker run --volumes-from <containerA> <imageB>   # borrow A's mounts
```

## Notes
- Sharing is by **the volume**, not by the network — the containers don't need to
  be connected to talk through files.
- Use `:ro` on the reader if it should never modify the data.
- `--volumes-from` copies another container's mount setup (handy for backup jobs).

## Run
```bash
docker volume create shared

# Producer writes into the shared volume:
docker run --rm -v shared:/data alpine sh -c 'echo "message from producer" > /data/msg.txt'

# Consumer (a different container) reads the same file:
docker run --rm -v shared:/data alpine cat /data/msg.txt
```

## Expected output
```
message from producer
```

## Try it — live shared writes
```bash
# Keep a writer running in the background...
docker run -d --name writer -v shared:/data alpine \
  sh -c 'while true; do date >> /data/log.txt; sleep 1; done'

# ...and read the growing file from a separate container:
docker run --rm -v shared:/data alpine tail -n 3 /data/log.txt

docker rm -f writer
docker volume rm shared
```
