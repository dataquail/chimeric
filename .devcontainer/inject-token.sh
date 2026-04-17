#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env"

# Extract the Claude Code OAuth token from macOS Keychain
KEYCHAIN_USER="$(whoami)"
CREDENTIALS_JSON="$(security find-generic-password -s "Claude Code-credentials" -a "$KEYCHAIN_USER" -w 2>/dev/null)" || {
  echo "Error: Could not find Claude Code credentials in Keychain for user '$KEYCHAIN_USER'." >&2
  echo "Make sure you are logged into Claude Code (run 'claude' and complete login)." >&2
  exit 1
}

OAUTH_TOKEN="$(echo "$CREDENTIALS_JSON" | python3 -c "import sys, json; print(json.load(sys.stdin)['claudeAiOauth']['accessToken'])")" || {
  echo "Error: Could not parse OAuth token from Keychain credentials." >&2
  exit 1
}

if [[ -z "$OAUTH_TOKEN" ]]; then
  echo "Error: Extracted OAuth token is empty." >&2
  exit 1
fi

# Update or append the token in the .env file
if [[ ! -f "$ENV_FILE" ]]; then
  echo "CLAUDE_CODE_OAUTH_TOKEN=${OAUTH_TOKEN}" > "$ENV_FILE"
  echo "Created ${ENV_FILE} with OAuth token."
elif grep -q "^CLAUDE_CODE_OAUTH_TOKEN=" "$ENV_FILE"; then
  # Replace the existing value in-place
  sed -i '' "s|^CLAUDE_CODE_OAUTH_TOKEN=.*|CLAUDE_CODE_OAUTH_TOKEN=${OAUTH_TOKEN}|" "$ENV_FILE"
  echo "Updated CLAUDE_CODE_OAUTH_TOKEN in ${ENV_FILE}."
else
  echo "CLAUDE_CODE_OAUTH_TOKEN=${OAUTH_TOKEN}" >> "$ENV_FILE"
  echo "Appended CLAUDE_CODE_OAUTH_TOKEN to ${ENV_FILE}."
fi
