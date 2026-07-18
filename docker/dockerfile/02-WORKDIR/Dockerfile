# See README.md for full notes.
FROM alpine:3.20

# WORKDIR sets the current directory for RUN/CMD/COPY/ADD that follow.
# It creates the directory if it does not exist.
WORKDIR /app

# This RUN executes inside /app, so the file lands in /app/where.txt
RUN pwd > where.txt

CMD ["cat", "/app/where.txt"]
