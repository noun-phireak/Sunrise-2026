# See README.md for full notes.
FROM alpine:3.20

# By default, shell-form RUN uses ["/bin/sh", "-c"].
# SHELL changes that default for all following shell-form commands.

# Make the shell fail fast on errors and unset variables.
SHELL ["/bin/sh", "-euxc"]

# Because of -x, this command echoes itself during the build.
RUN echo "This RUN uses the custom SHELL" > /shell.log

CMD ["cat", "/shell.log"]
