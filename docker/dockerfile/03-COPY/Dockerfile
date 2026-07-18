# See README.md for full notes.
FROM alpine:3.20
WORKDIR /app

# COPY <src>... <dest>
# src is relative to the BUILD CONTEXT (the folder you pass to `docker build`).
COPY hello.txt .

# Copy multiple files into a directory (note the trailing slash on dest)
COPY hello.txt notes.txt /app/data/

CMD ["sh", "-c", "cat /app/hello.txt && echo '---' && ls /app/data"]
