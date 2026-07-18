# 04 — ADD

## What it does
`ADD` is like `COPY` but with **two extra powers**:
1. It **auto-extracts** local tar archives (`.tar`, `.tar.gz`, `.tgz`, …) into the destination.
2. It can fetch files from a **remote URL**.

## Syntax
```dockerfile
ADD <src>... <dest>
ADD --chown=user:group <src> <dest>
```

## Notes
- **Rule of thumb: prefer `COPY`.** Only use `ADD` when you specifically want
  tar auto-extraction. `ADD`'s magic behavior surprises people.
- Auto-extraction works only for **local** archives. A URL is downloaded but
  **not** extracted.
- For downloading URLs, prefer `RUN wget`/`curl` — you can verify checksums and
  clean up in the same layer. `ADD <url>` cannot be cleaned up.
- Modern Docker also supports `ADD <git-repo-url>` to clone a repo.

## Build
```bash
docker build -t lab-add .
```

## Run
```bash
docker run --rm lab-add
```

## Expected output
```
total 8
-rw-r--r--    1 root     root            21 ... a.txt
-rw-r--r--    1 root     root            21 ... b.txt
```
(The `.tar.gz` was unpacked automatically into `/app/extracted/`.)

## Try it
Swap `ADD` for `COPY` and rebuild — you'll see the `stuff.tar.gz` file itself
instead of the extracted `a.txt` / `b.txt`, proving the difference.
