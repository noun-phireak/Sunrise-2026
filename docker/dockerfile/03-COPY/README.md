# 03 — COPY

## What it does
`COPY` copies files/folders from the **build context** (the directory you give to
`docker build`) into the image's filesystem.

## Syntax
```dockerfile
COPY <src>... <dest>
COPY ["<src>", "<dest>"]      # exec form, needed if paths have spaces
```

## Notes
- `<src>` is **relative to the build context** — you cannot copy files from
  outside the context (e.g. `../secret` is not allowed).
- If `<dest>` ends with `/`, it is treated as a directory (created if needed).
- Supports wildcards: `COPY *.txt /app/`.
- `COPY --chown=user:group src dest` sets ownership (see `12-USER`).
- Use a `.dockerignore` file to keep junk (node_modules, .git) out of the context.
- Prefer `COPY` over `ADD` for plain files — it's simpler and more predictable
  (see `04-ADD` for the difference).

## Build
```bash
docker build -t lab-copy .
```

## Run
```bash
docker run --rm lab-copy
```

## Expected output
```
Hello from a copied file!
---
hello.txt
notes.txt
```

## Try it
- Add a file, rebuild — notice only the changed layer rebuilds.
- Try `COPY ../hello.txt .` and watch it fail (outside the build context).
