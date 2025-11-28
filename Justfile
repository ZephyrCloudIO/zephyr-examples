# List all available commands
default:
    @just --list

# Install dependencies in all directories
install-all:
    @echo "Installing vanilla dependencies..."
    cd vanilla && pnpm install
    @echo "Installing nx examples..."
    cd nx/examples/mf-nx-rspack && pnpm install
    @echo "Installing turborepo examples..."
    cd turborepo/examples/mf-turbo-rspack && pnpm install
    @echo "Installing scripts dependencies..."
    cd scripts && pnpm install
    @echo "✓ All dependencies installed"

# Install dependencies in vanilla directory
install-vanilla:
    cd vanilla && pnpm install

# Install dependencies in nx examples
install-nx:
    cd nx/examples/mf-nx-rspack && pnpm install

# Install dependencies in turborepo examples
install-turborepo:
    cd turborepo/examples/mf-turbo-rspack && pnpm install

# Clean all node_modules in all directories
clean:
    @echo "Cleaning vanilla..."
    cd vanilla && pnpm remove-all-node-modules
    @echo "Cleaning nx..."
    cd nx && find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
    @echo "Cleaning turborepo..."
    cd turborepo && find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +
    @echo "✓ All node_modules removed"

# Clean node_modules in vanilla directory
clean-vanilla:
    cd vanilla && pnpm remove-all-node-modules

# Clean node_modules in nx directory
clean-nx:
    cd nx && find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

# Clean node_modules in turborepo directory
clean-turborepo:
    cd turborepo && find . -name 'node_modules' -type d -prune -exec rm -rf '{}' +

# Clean all dist folders in all directories
clean-dist-all:
    @echo "Cleaning vanilla dist..."
    cd vanilla && pnpm remove-all-dist
    @echo "Cleaning nx dist..."
    cd nx && find . -name 'dist' -type d -prune -exec rm -rf '{}' +
    @echo "Cleaning turborepo dist..."
    cd turborepo && find . -name 'dist' -type d -prune -exec rm -rf '{}' +
    @echo "✓ All dist folders removed"

# Clean dist folders in vanilla directory
clean-dist-vanilla:
    cd vanilla && pnpm remove-all-dist

# Clean dist folders in nx directory
clean-dist-nx:
    cd nx && find . -name 'dist' -type d -prune -exec rm -rf '{}' +

# Clean dist folders in turborepo directory
clean-dist-turborepo:
    cd turborepo && find . -name 'dist' -type d -prune -exec rm -rf '{}' +

# Build a specific example in vanilla directory
build-vanilla example:
    cd vanilla/examples/{{ example }} && pnpm build

# Build a specific example in nx directory
build-nx example:
    cd nx/examples/{{ example }} && pnpm build

# Build a specific example in turborepo directory
build-turborepo example:
    cd turborepo/examples/{{ example }} && pnpm build

# Full reset - clean everything and reinstall
reset-all: clean clean-dist-all install-all
    @echo "✓ Full reset complete"

# Reset vanilla directory
reset-vanilla: clean-vanilla clean-dist-vanilla install-vanilla
    @echo "✓ Vanilla reset complete"

# Reset nx directory
reset-nx: clean-nx clean-dist-nx install-nx
    @echo "✓ NX reset complete"

# Reset turborepo directory
reset-turborepo: clean-turborepo clean-dist-turborepo install-turborepo
    @echo "✓ Turborepo reset complete"

# Build all vanilla examples in every environment
build-all-vanilla:
	#!/usr/bin/env bash
	set -euo pipefail

	echo "Building all vanilla examples..."
	cd vanilla/examples
	for d in */; do
	  [ -d "$d" ] || continue
	  echo "→ Building $d"
	  (cd "$d" && pnpm build)
	done
	cd ../..

	echo "✓ All vanilla examples built successfully"

# Build all nx examples in every environment
build-all-nx:
	#!/usr/bin/env bash
	set -euo pipefail

	echo "Building all nx examples..."
	cd nx/examples
	for d in */; do
	  [ -d "$d" ] || continue
	  echo "→ Building $d"
	  (cd "$d" && pnpm build)
	done
	cd ../..

	echo "✓ All nx examples built successfully"

# Build all turborepo examples in every environment
build-all-turborepo:
	#!/usr/bin/env bash
	set -euo pipefail

	echo "Building all turborepo examples..."
	cd turborepo/examples
	for d in */; do
	  [ -d "$d" ] || continue
	  echo "→ Building $d"
	  (cd "$d" && pnpm build)
	done
	cd ../..

	echo "✓ All turborepo examples built successfully"

# Build all examples in every environment
build-all:
	#!/usr/bin/env bash
	set -euo pipefail

	echo "Building all vanilla examples..."
	cd vanilla/examples
	for d in */; do
	  [ -d "$d" ] || continue
	  echo "→ Building $d"
	  (cd "$d" && pnpm build)
	done
	cd ../..

	echo "Building all nx examples..."
	cd nx/examples
	for d in */; do
	  [ -d "$d" ] || continue
	  echo "→ Building $d"
	  (cd "$d" && pnpm build)
	done
	cd ../..

	echo "Building all turborepo examples..."
	cd turborepo/examples
	for d in */; do
	  [ -d "$d" ] || continue
	  echo "→ Building $d"
	  (cd "$d" && pnpm build)
	done
	cd ../..

	echo "✓ All examples built successfully"

