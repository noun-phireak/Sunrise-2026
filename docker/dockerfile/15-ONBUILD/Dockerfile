# See README.md for full notes.
# This is the PARENT image. The ONBUILD triggers do NOTHING here.
# They fire only when ANOTHER Dockerfile uses "FROM lab-onbuild-parent".
FROM alpine:3.20
WORKDIR /app

# These are deferred: they run in the CHILD build, not this one.
ONBUILD COPY . /app
ONBUILD RUN echo "ONBUILD triggered in the CHILD image!" > /app/onbuild.log

CMD ["echo", "This is the parent image."]
