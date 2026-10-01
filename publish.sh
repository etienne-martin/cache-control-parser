#!/usr/bin/env bash
set -euo pipefail

if [[ "$#" -ne 1 ]]; then
  printf 'Usage: ./publish.sh <package.tgz>\n' >&2
  exit 1
fi

PACKAGE_TARBALL="$(
  node -e '
    process.stdout.write(require("node:path").resolve(process.argv[1]));
  ' "$1"
)"

if [[ ! -f "$PACKAGE_TARBALL" ]]; then
  printf 'Package tarball not found: %s\n' "$PACKAGE_TARBALL" >&2
  exit 1
fi

PACKAGE_NAME="$(node --print "require('./package.json').name")"
PACKAGE_VERSION="$(node --print "require('./package.json').version")"
TARBALL_MANIFEST="$(tar -xOf "$PACKAGE_TARBALL" package/package.json)"
TARBALL_NAME="$(
  node -e '
    const manifest = JSON.parse(process.argv[1]);
    if (typeof manifest.name !== "string") process.exit(1);
    process.stdout.write(manifest.name);
  ' "$TARBALL_MANIFEST"
)"
TARBALL_VERSION="$(
  node -e '
    const manifest = JSON.parse(process.argv[1]);
    if (typeof manifest.version !== "string") process.exit(1);
    process.stdout.write(manifest.version);
  ' "$TARBALL_MANIFEST"
)"

if [[ "$TARBALL_NAME" != "$PACKAGE_NAME" || "$TARBALL_VERSION" != "$PACKAGE_VERSION" ]]; then
  printf 'Tarball is %s@%s, expected %s@%s\n' \
    "$TARBALL_NAME" \
    "$TARBALL_VERSION" \
    "$PACKAGE_NAME" \
    "$PACKAGE_VERSION" >&2
  exit 1
fi

PUBLISHED_VERSIONS="$(npm view "$PACKAGE_NAME" versions --json)"
PUBLISH_STATUS="$(
  node -e '
    const value = JSON.parse(process.argv[1]);
    const versions = Array.isArray(value) ? value : [value];
    process.stdout.write(versions.includes(process.argv[2]) ? "published" : "unpublished");
  ' "$PUBLISHED_VERSIONS" "$PACKAGE_VERSION"
)"

if [[ "$PUBLISH_STATUS" == "published" ]]; then
  printf 'Already published: %s@%s\n' "$PACKAGE_NAME" "$PACKAGE_VERSION"
  exit 0
fi

npm publish "$PACKAGE_TARBALL" --ignore-scripts
