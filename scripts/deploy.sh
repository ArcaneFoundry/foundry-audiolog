#!/usr/bin/env bash

set -euo pipefail

MODULE_ID="foundry-audiolog"
REMOTE="${REMOTE:-root@foundry.digitalframeworks.org}"
REMOTE_DIR="${REMOTE_DIR:-/var/foundrydata/Data/modules/$MODULE_ID}"
REMOTE_CHOWN="${REMOTE_CHOWN-foundry:foundry}"

if [[ ! "$REMOTE" =~ ^[A-Za-z0-9._@-]+$ ]] || [[ "$REMOTE" == -* ]]; then
  echo "Unsafe REMOTE value: '$REMOTE'" >&2
  exit 2
fi
if [[ ! "$REMOTE_DIR" =~ ^/[A-Za-z0-9._/-]+$ ]] || [[ "$REMOTE_DIR" == *"/../"* ]] || [[ "$REMOTE_DIR" == */.. ]]; then
  echo "REMOTE_DIR must be a safe absolute path: '$REMOTE_DIR'" >&2
  exit 2
fi
if [[ -n "$REMOTE_CHOWN" ]] && [[ ! "$REMOTE_CHOWN" =~ ^[A-Za-z_][A-Za-z0-9_-]*(:[A-Za-z_][A-Za-z0-9_-]*)?$ ]]; then
  echo "REMOTE_CHOWN must be user or user:group: '$REMOTE_CHOWN'" >&2
  exit 2
fi

npm run build

ssh "$REMOTE" "mkdir -p -- '$REMOTE_DIR'"
rsync -az --delete dist/ "$REMOTE:$REMOTE_DIR/"
if [[ -n "$REMOTE_CHOWN" ]]; then
  ssh "$REMOTE" "chown -R -- '$REMOTE_CHOWN' '$REMOTE_DIR'"
fi

echo "Deployed $MODULE_ID to $REMOTE:$REMOTE_DIR"
