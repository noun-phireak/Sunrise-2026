# See README.md for full notes.
FROM alpine:3.20

# VOLUME declares a mount point for persistent / shared data.
# Data written here lives OUTSIDE the container's writable layer.
VOLUME ["/data"]

# Each run appends a timestamped line into the volume.
CMD ["sh", "-c", "date >> /data/log.txt; echo '--- /data/log.txt ---'; cat /data/log.txt"]
