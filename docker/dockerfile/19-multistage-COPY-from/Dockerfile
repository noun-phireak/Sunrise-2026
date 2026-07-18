# See README.md for full notes.

# ---------- Stage 1: builder ----------
# Named "builder" via "AS builder". Has the whole compiler toolchain.
FROM alpine:3.20 AS builder
WORKDIR /src
RUN apk add --no-cache gcc musl-dev
COPY hello.c .
# Build a static binary so it needs no libraries in the final image.
RUN gcc -static -O2 -o hello hello.c

# ---------- Stage 2: final ----------
# A clean, tiny image. It does NOT contain gcc or the source code.
FROM alpine:3.20
WORKDIR /app
# COPY --from=builder pulls ONLY the compiled binary from the first stage.
COPY --from=builder /src/hello /app/hello

CMD ["/app/hello"]
