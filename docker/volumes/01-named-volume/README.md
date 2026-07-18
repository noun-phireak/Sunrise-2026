# 01 — Named volume

## What it does
A **named volume** is storage **managed by Docker**. You give it a name, Docker
stores the data in its own area (`/var/lib/docker/volumes/…`), and the data
**survives** even after the container is deleted. This is the default choice for
databases and app data.

## Syntax
```bash
docker volume create <name>
docker run -v <name>:/path/in/container <image>        # short -v form
docker run --mount type=volume,src=<name>,dst=/path <image>   # explicit form
```

## Notes
- **Docker owns the storage** — you don't pick a host path; Docker manages it.
- **Persists** across container removal. Delete it explicitly with `docker volume rm`.
- **Portable** — attach the same volume to a different container and the data is there.
- The `--mount` form is more explicit and self-documenting than `-v`; both work.

## Run — data persists across two separate containers
```bash
docker volume create app-data

# Container #1 writes a file into the volume, then exits:
docker run --rm -v app-data:/data alpine sh -c 'echo "saved at $(date)" > /data/note.txt'

# Container #2 is a BRAND NEW container — but the data is still there:
docker run --rm -v app-data:/data alpine cat /data/note.txt
```

## Expected output
```
saved at Sat Jul 18 ... 2026
```
The second container never wrote the file — proof the **volume** kept the data,
not the container.

## Try it
```bash
docker volume ls                     # app-data is listed
docker volume inspect app-data       # see the Mountpoint Docker manages
docker run --rm -v app-data:/data alpine ls -l /data
docker volume rm app-data            # remove it (data is gone for good)
```
