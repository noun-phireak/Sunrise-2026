#!/bin/bash

TELEGRAM_TOKEN="8551367142:AAF5lRRcr1uDKEjqQGJLa9uN0y_U9WyhpbQ"
CHAT_ID="-1003815410927"

ENVIRONMENT="${ENVIRONMENT:-production}"
COMMIT_MESSAGE="${COMMIT_MESSAGE:-N/A}"
TRIGGER_BRANCH="${TRIGGER_BRANCH:-N/A}"
COMMIT_AUTHOR="${COMMIT_AUTHOR:-N/A}"
STATUS="${STATUS:-SUCCESS}"

MESSAGE="🚀 *Deployment Notification*
━━━━━━━━━━━━━━━━━━━━━
*Environment:* ${ENVIRONMENT}
*Commit Message:* ${COMMIT_MESSAGE}
*Trigger Branch:* ${TRIGGER_BRANCH}
*Commit Author:* ${COMMIT_AUTHOR}
*Status:* ${STATUS}
━━━━━━━━━━━━━━━━━━━━━"

curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage" \
  -d chat_id="${CHAT_ID}" \
  -d text="${MESSAGE}" \
  -d parse_mode="Markdown"
