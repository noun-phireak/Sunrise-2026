# See README.md for full notes.
FROM alpine:3.20
WORKDIR /www

# A tiny web page served by busybox httpd (the httpd applet lives in busybox-extras)
RUN apk add --no-cache busybox-extras
RUN echo "<h1>EXPOSE lab works!</h1>" > index.html

# EXPOSE DOCUMENTS that the container listens on port 80.
# It does NOT publish the port — you still need `docker run -p`.
EXPOSE 80

# -f = foreground, -p = port, -h = document root
CMD ["httpd", "-f", "-p", "80", "-h", "/www"]
