#!/usr/bin/env bash
set -euo pipefail

target_root=${1:?"Pass an empty destination directory"}

pnpm dlx create-rsbuild@2.1.8 "${target_root}/host" \
  --template react-ts \
  --packageName host
pnpm dlx create-rsbuild@2.1.8 "${target_root}/header" \
  --template react-ts \
  --packageName header
pnpm dlx create-rsbuild@2.1.8 "${target_root}/hero" \
  --template react-ts \
  --packageName hero
