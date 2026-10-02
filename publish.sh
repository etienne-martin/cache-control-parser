#!/usr/bin/env bash
set -euo pipefail

PACKAGE_NAME="$(node --print "require('./package.json').name")"
PACKAGE_VERSION="$(node --print "require('./package.json').version")"

if npm view "$PACKAGE_NAME@$PACKAGE_VERSION" version >/dev/null 2>&1; then
  printf 'Already published: %s@%s\n' "$PACKAGE_NAME" "$PACKAGE_VERSION"
else
  npm publish
fi
