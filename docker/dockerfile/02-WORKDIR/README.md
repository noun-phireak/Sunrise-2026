# 02 — WORKDIR

## What it does
`WORKDIR` sets the **working directory** for any `RUN`, `CMD`, `ENTRYPOINT`,
`COPY`, and `ADD` instructions that come after it.

## Syntax
```dockerfile
WORKDIR /path/to/dir
```

## Notes
- It **creates** the directory if it doesn't exist (like `mkdir -p && cd`).
- It can be used multiple times; relative paths are resolved against the previous
  `WORKDIR`.
- **Do not** use `RUN cd /app` to change directory — the change is lost after the
  `RUN` finishes. Use `WORKDIR` instead.
- You can reference environment variables: `WORKDIR $MY_DIR`.

## Build
```bash
docker build -t lab-workdir .
```

## Run
```bash
docker run --rm lab-workdir
```

## Expected output
```
/app
```
(The container prints the working directory captured at build time.)

## Try it
```bash
# Confirm the working dir at run time too:
docker run --rm lab-workdir pwd    # -> /app
```
