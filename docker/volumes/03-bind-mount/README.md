# 03 — Bind mount

## What it does
A **bind mount** maps a **folder (or file) on your host** directly into the
container. The container reads/writes the **real host path** live. Perfect for
developing (edit code on the host, see it instantly) and for injecting config.

## Syntax
```bash
docker run -v /absolute/host/path:/path/in/container <image>
docker run --mount type=bind,src="$(pwd)/site",dst=/usr/share/nginx/html <image>
```

## Notes
- The source is a **real host path** (starts with `/` or `.`), not a Docker name.
  Compare with `01` where Docker owns the storage.
- Changes on the host appear **instantly** in the container and vice-versa — no
  rebuild, no copy.
- **Not portable** — it depends on that path existing on every host.
- Add `:ro` to make it **read-only** (config you don't want the container to change).
- A bind mount **hides** whatever was in the container's target dir while mounted.

## Run — nginx serves files straight from this folder
```bash
cd 03-bind-mount
docker run --rm -d --name bind-demo \
  -p 8080:80 \
  -v "$(pwd)/site:/usr/share/nginx/html:ro" \
  nginx:alpine

curl -s http://localhost:8080 | grep '<h1>'
```

## Expected output
```
    <h1>Served straight from the host</h1>
```

## Try it — live edit, no rebuild
```bash
# Change the file on the HOST, then curl again — the change is already live:
echo '<h1>Edited on the host!</h1>' > site/index.html
curl -s http://localhost:8080 | grep '<h1>'
docker rm -f bind-demo
```
