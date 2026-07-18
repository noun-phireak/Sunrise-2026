# See README.md for full notes.
FROM alpine:3.20
WORKDIR /app

# ADD can AUTO-EXTRACT a local tar archive into the destination.
# (COPY would just place the .tar.gz file as-is.)
ADD stuff.tar.gz /app/extracted/

CMD ["ls", "-l", "/app/extracted"]
