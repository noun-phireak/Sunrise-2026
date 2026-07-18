# This is the CHILD image. Building it FIRES the parent's ONBUILD triggers.
FROM lab-onbuild-parent

# You write almost nothing here — the parent's ONBUILD already did the COPY + RUN.
CMD ["sh", "-c", "cat /app/onbuild.log && echo '---' && cat /app/app.txt"]
