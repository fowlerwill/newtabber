#!/usr/bin/env bash
#
# Packages the extension as dist/newtabber-<version>.zip.
#
# With --sign it also sends that build to AMO for unlisted signing and saves the
# signed .xpi alongside the zip. Signing needs credentials from
# https://addons.mozilla.org/developers/addon/api/key/:
#
#   AMO_JWT_ISSUER=... AMO_JWT_SECRET=... ./dist.sh --sign
#
# Usage: ./dist.sh [--sign]
set -euo pipefail

cd "$(dirname "$0")"
ROOT=$PWD

NAME=newtabber

# Everything that ships. Add new source files here.
FILES=(manifest.json newtab.html newtab.css newtab.js icons)

SIGN=false
case "${1:-}" in
  "") ;;
  --sign) SIGN=true ;;
  *)
    echo "usage: dist.sh [--sign]" >&2
    exit 2
    ;;
esac

VERSION=$(sed -n 's/.*"version"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' manifest.json | head -1)
if [[ -z $VERSION ]]; then
  echo "dist.sh: could not read \"version\" from manifest.json" >&2
  exit 1
fi

for path in "${FILES[@]}"; do
  if [[ ! -e $path ]]; then
    echo "dist.sh: $path is missing — fix FILES in this script or restore the file" >&2
    exit 1
  fi
done

# Staging means the zip and the signed build are byte-for-byte the same tree,
# and manifest.json lands at the archive root where Firefox expects it.
STAGE=$(mktemp -d)
trap 'rm -rf "$STAGE"' EXIT
cp -R "${FILES[@]}" "$STAGE/"

mkdir -p dist
OUT="dist/$NAME-$VERSION.zip"
if [[ -f $OUT ]]; then
  echo "Replacing $OUT — bump \"version\" in manifest.json to keep builds side by side."
fi
rm -f "$OUT"

(cd "$STAGE" && zip -qr "$ROOT/$OUT" . -x '*.DS_Store')
echo "Built $OUT ($(du -h "$OUT" | cut -f1))"

if [[ $SIGN == false ]]; then
  echo
  echo "Install it: open about:debugging#/runtime/this-firefox, choose"
  echo "\"Load Temporary Add-on…\" and pick the zip. It lasts until Firefox restarts;"
  echo "a permanent install needs a signed build (./dist.sh --sign)."
  exit 0
fi

: "${AMO_JWT_ISSUER:?dist.sh: set AMO_JWT_ISSUER (addons.mozilla.org/developers/addon/api/key/)}"
: "${AMO_JWT_SECRET:?dist.sh: set AMO_JWT_SECRET}"

# Passed by environment rather than --api-key/--api-secret, which would put the
# secret in the process list.
WEB_EXT_API_KEY="$AMO_JWT_ISSUER" \
WEB_EXT_API_SECRET="$AMO_JWT_SECRET" \
  npx --yes web-ext sign \
    --source-dir="$STAGE" \
    --artifacts-dir="$ROOT/dist" \
    --channel=unlisted

echo
echo "Signed build in dist/. Install it from about:addons -> gear -> Install Add-on From File."
