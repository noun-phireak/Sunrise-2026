# 03 — build

## What it does
`build:` makes Compose **build an image from a Dockerfile** (in this folder)
instead of pulling one. Great for your own application code.

## Syntax
```yaml
services:
  app:
    build: .                     # short form: build context = current dir
    # --- or the long form: ---
    build:
      context: .
      dockerfile: Dockerfile
      args:
        APP_VERSION: "2.0"
    image: lab-compose-build:latest
```

## Notes
- `context` is the folder sent to the builder; the `Dockerfile` and any `COPY`
  sources must live inside it.
- `args` map to `ARG` in the Dockerfile (build-time only — see the Dockerfile lab's `07-ARG`).
- Adding `image:` names the built image so you can push/reuse it.
- Compose only builds on first `up`. Force a rebuild with `--build`.

## Build & Run
```bash
docker compose up --build
```

## Expected output
```
app-1  | Built by Compose — app version 2.0
```

## Try it
```bash
docker compose build                 # build without running
docker images lab-compose-build      # see the tagged image
docker compose down --rmi local      # remove the image we built
```
