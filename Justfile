# Zephyr Examples Justfile
# Manage vanilla, nx, and turborepo directories independently

# List all available commands
default:
    @just --list

# Install dependencies in all directories
install-all:
    @echo "Installing vanilla dependencies..."
    cd vanilla && pnpm install
    @echo "Installing nx dependencies..."
    cd nx && pnpm install
    @echo "Installing turborepo dependencies..."
    cd turborepo && pnpm install
    @echo "✓ All dependencies installed"

# Install dependencies in vanilla directory
install-vanilla:
    cd vanilla && pnpm install

# Install dependencies in nx directory
install-nx:
    cd nx && pnpm install

# Install dependencies in turborepo directory
install-turborepo:
    cd turborepo && pnpm install

# Clean all node_modules in all directories
clean-all:
    @echo "Cleaning vanilla..."
    cd vanilla && pnpm remove-all-node-modules
    @echo "Cleaning nx..."
    cd nx && pnpm remove-all-node-modules
    @echo "Cleaning turborepo..."
    cd turborepo && pnpm remove-all-node-modules
    @echo "✓ All node_modules removed"

# Clean node_modules in vanilla directory
clean-vanilla:
    cd vanilla && pnpm remove-all-node-modules

# Clean node_modules in nx directory
clean-nx:
    cd nx && pnpm remove-all-node-modules

# Clean node_modules in turborepo directory
clean-turborepo:
    cd turborepo && pnpm remove-all-node-modules

# Clean all dist folders in all directories
clean-dist-all:
    @echo "Cleaning vanilla dist..."
    cd vanilla && pnpm remove-all-dist
    @echo "Cleaning nx dist..."
    cd nx && pnpm remove-all-dist
    @echo "Cleaning turborepo dist..."
    cd turborepo && pnpm remove-all-dist
    @echo "✓ All dist folders removed"

# Clean dist folders in vanilla directory
clean-dist-vanilla:
    cd vanilla && pnpm remove-all-dist

# Clean dist folders in nx directory
clean-dist-nx:
    cd nx && pnpm remove-all-dist

# Clean dist folders in turborepo directory
clean-dist-turborepo:
    cd turborepo && pnpm remove-all-dist

# Run sherif dependency checker in vanilla
sherif-vanilla:
    cd vanilla && pnpm run-sherif

# Run sherif dependency checker in nx
sherif-nx:
    cd nx && pnpm run-sherif

# Run sherif dependency checker in turborepo
sherif-turborepo:
    cd turborepo && pnpm run-sherif

# Run sherif in all directories
sherif-all:
    @echo "Checking vanilla..."
    cd vanilla && pnpm run-sherif
    @echo "Checking nx..."
    cd nx && pnpm run-sherif
    @echo "Checking turborepo..."
    cd turborepo && pnpm run-sherif

# Build a specific example in vanilla directory
build-vanilla example:
    cd vanilla/examples/{{example}} && pnpm build

# Build a specific example in nx directory
build-nx example:
    cd nx/examples/{{example}} && pnpm build

# Build a specific example in turborepo directory
build-turborepo example:
    cd turborepo/examples/{{example}} && pnpm build

# List all vanilla examples
list-vanilla:
    @echo "Vanilla examples:"
    @ls -1 vanilla/examples/

# List all nx examples
list-nx:
    @echo "NX examples:"
    @ls -1 nx/examples/

# List all turborepo examples
list-turborepo:
    @echo "Turborepo examples:"
    @ls -1 turborepo/examples/

# List all examples from all directories
list-all:
    @just list-vanilla
    @echo ""
    @just list-nx
    @echo ""
    @just list-turborepo

# Full reset - clean everything and reinstall
reset-all: clean-all clean-dist-all install-all
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

# Show repository structure
tree:
    @echo "Repository structure:"
    @tree -L 2 -d -I 'node_modules|dist|.git|.nx|.turbo' .

# Show status of all directories
status:
    @echo "=== Vanilla ==="
    @echo "Examples: $(ls vanilla/examples | wc -l | xargs)"
    @echo "Has node_modules: $([ -d vanilla/node_modules ] && echo 'Yes' || echo 'No')"
    @echo ""
    @echo "=== NX ==="
    @echo "Examples: $(ls nx/examples | wc -l | xargs)"
    @echo "Has node_modules: $([ -d nx/node_modules ] && echo 'Yes' || echo 'No')"
    @echo ""
    @echo "=== Turborepo ==="
    @echo "Examples: $(ls turborepo/examples | wc -l | xargs)"
    @echo "Has node_modules: $([ -d turborepo/node_modules ] && echo 'Yes' || echo 'No')"
