#!/bin/bash

DEV_DEPS="packages/mobile-sdk/lib/devDependencies.json"

# Backup the original devDependencies file
cp "$DEV_DEPS" "$DEV_DEPS.bak"

# Read devDependencies file into a variable and update it
UPDATED_DEV_DEPS=$(while IFS= read -r line; do
  if echo "$line" | grep -q '"zephyr-repack-plugin"'; then
    echo "$line"
    echo '    "name": "zephyr-repack-plugin",'
    echo '    "version": "../../submodules/zephyr-packages/libs/zephyr-repack-plugin",'
    echo '    "devOnly": true'
    while IFS= read -r skip_line && [[ ! "$skip_line" =~ ^[[:space:]]*} ]]; do :; done
    echo "$skip_line"
  else
    echo "$line"
  fi
done < "$DEV_DEPS")

echo "$UPDATED_DEV_DEPS" > "$DEV_DEPS"
