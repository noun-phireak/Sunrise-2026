# See README.md for full notes.
FROM alpine:3.20

# Create a non-root user and group.
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Everything AFTER this line (RUN/CMD/ENTRYPOINT) runs as appuser, not root.
USER appuser

CMD ["id"]
