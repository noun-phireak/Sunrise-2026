# 15 — ONBUILD

## What it does
`ONBUILD` registers an instruction that does **nothing in the current image**, but
**fires automatically when another Dockerfile uses this image as its base**
(`FROM`). It's a way to build reusable "framework" base images.

## Syntax
```dockerfile
ONBUILD <any instruction>
# e.g.
ONBUILD COPY . /app
ONBUILD RUN make build
```

## Notes
- The triggers run **once**, in the **child** build, right after its `FROM` line.
- Useful for language base images: "when someone builds FROM me, copy their source
  and compile it."
- Triggers do **not** cascade — they fire in direct children only, not grandchildren.
- Can be surprising/hidden. Use sparingly and document them well.

## This lab has two Dockerfiles
- `./Dockerfile` — the **parent** with `ONBUILD` triggers.
- `./child/Dockerfile` — the **child** that inherits and triggers them.

## Step 1 — build the parent
```bash
docker build -t lab-onbuild-parent .
```
Notice: the ONBUILD lines just get **registered**, nothing is copied yet.

## Step 2 — build the child
```bash
cd child
docker build -t lab-onbuild-child .
```
During **this** build you'll see the triggers fire:
```
# Executing 2 build triggers
 ---> COPY . /app
 ---> RUN echo "ONBUILD triggered in the CHILD image!" > /app/onbuild.log
```

## Step 3 — run the child
```bash
docker run --rm lab-onbuild-child
```

## Expected output
```
ONBUILD triggered in the CHILD image!
---
This app.txt file gets copied by the parent ONBUILD trigger.
```
