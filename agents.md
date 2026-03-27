# Zephyr Examples — Agent Guide

## What This Repo Is
Starter projects and reference examples for Zephyr Cloud — a deployment platform
for Module Federation micro-frontends. Each subdirectory is a standalone,
buildable project.

## Layout
- `bundlers/`            — Zephyr + bundler setups, no MF (Vite, Rspack, Rollup, etc.)
- `module-federation/`   — MF-specific examples (Zephyr's core value prop)
- `frameworks/`          — Non-React frameworks + React Native
- `server/`              — Server-side / edge examples (Nitro)
- `build-systems/`       — Zephyr + Nx / Turborepo integration
- `templates.json`       — Machine-readable index of all examples

## How to Use an Example
Each example is self-contained:
```
cd {category}/{example}
pnpm install
pnpm dev        # local dev server
pnpm build      # builds + deploys to Zephyr Cloud (needs ZE_SERVER_TOKEN)
```

## Finding the Right Example
- Read `templates.json` for structured metadata (framework, bundler, features, complexity)
- New to Zephyr? Start with `bundlers/react-vite`
- Need Module Federation? Browse `module-federation/`
- Using a specific bundler? Filter templates.json by bundler field

## Common Commands
- `pnpm install` — install deps (each example is independent)
- `pnpm dev` — start local dev server
- `pnpm build` — build + deploy to Zephyr
- `pnpm --filter @zephyr-examples/scripts generate-templates` — regenerate templates.json
- `pnpm --filter @zephyr-examples/scripts generate-readme` — regenerate root README
- `pnpm --filter @zephyr-examples/scripts validate-readmes` — validate all README front matter

## Key Files per Example
- `README.md` — YAML front matter with metadata + human docs
- `package.json` — deps and scripts
- `zephyr.config.ts` or plugin config — Zephyr integration point
- `federation.config.ts` or equivalent — Module Federation config (if applicable)

## Adding a New Example
See `CONTRIBUTING.md` for naming conventions, required files, and front matter spec.
