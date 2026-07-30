#!/usr/bin/env bash
set -euo pipefail

app_directory=${1:?"Pass an existing Rsbuild application directory"}

pnpm --dir "${app_directory}" --save-exact add \
  react@19.2.7 \
  react-dom@19.2.7
pnpm --dir "${app_directory}" --save-exact add --save-dev \
  @module-federation/rsbuild-plugin@2.8.0 \
  @rsbuild/core@2.1.8 \
  @rsbuild/plugin-react@2.1.0 \
  @types/node@24.5.2 \
  @types/react@19.2.14 \
  @types/react-dom@19.2.3 \
  typescript@6.0.3 \
  zephyr-agent@1.2.0 \
  zephyr-rsbuild-plugin@1.2.0

# pnpm preserves existing scaffold prefixes while changing versions. Once the
# requested versions are installed, repeat those existing dependencies so -E
# normalizes their declarations to exact pins.
pnpm --dir "${app_directory}" --save-exact add \
  react@19.2.7 \
  react-dom@19.2.7
pnpm --dir "${app_directory}" --save-exact add --save-dev \
  @rsbuild/core@2.1.8 \
  @rsbuild/plugin-react@2.1.0 \
  @types/node@24.5.2 \
  @types/react@19.2.14 \
  @types/react-dom@19.2.3 \
  typescript@6.0.3
