# Zephyr Examples Reorg — Checklist

**ClickUp:** [ZE-1252](https://app.clickup.com/t/86ageva8x)

## Done

- [x] Directory restructure — 26 examples across bundlers/, module-federation/, frameworks/, server/, build-systems/
- [x] React Native consolidation — zephyr-metro-example + zephyr-repack-example into frameworks/
- [x] YAML front matter + templates.json on all 26 READMEs
- [x] Metadata scripts — validate-readmes, generate-templates, generate-readme
- [x] Auto-generated root README from templates.json
- [x] CONTRIBUTING.md — category guide, naming rules, front matter spec, PR checklist
- [x] agents.md — AI coding assistant discoverability
- [x] CI workflow — build-deploy-test.yml updated for new directory structure
- [x] ZephyrWelcome splash component — Shadow DOM React component with inline CSS/SVGs, applied to bundlers/react-vite as reference

## To Do

### 1. Link audit
Old paths (vanilla/, nx/, turborepo/) will 404 after merge. Grep and fix across repos:
- [ ] zephyr-documentation (high — user-facing docs)
- [ ] zephyr-website (high — marketing links)
- [ ] zephyr-packages (medium — package READMEs)
- [ ] zephyr-cloud-io (low — internal)
- [ ] zephyr-mono (low — internal)

### 2. Repo cleanup
- [ ] Add GitHub topics: `zephyr`, `examples`, `module-federation`, `micro-frontends`
- [ ] Add repo description: "Starter projects and reference examples for Zephyr Cloud"
- [ ] Archive zephyr-metro-example and zephyr-repack-example with redirect READMEs
- [ ] Handle 84MB GIF in frameworks/react-native-repack (LFS or removal)
- [ ] Merge stale Renovate PRs

### 3. Branded splash pages — [ZE-1265](https://app.clickup.com/t/86agftddz)
Apply ZephyrWelcome Shadow DOM component to all examples. Reference implementation in `bundlers/react-vite/src/ZephyrWelcome.tsx`.
- [ ] React bundler examples (5 remaining)
- [ ] MF monorepos (5 — target host app)
- [ ] Non-React frameworks (4 — Angular, Svelte, Solid, Astro wrappers)
- [ ] TanStack Start (1 — React-based)
- [ ] Rspress (1 — SSG, custom page approach)
- [ ] Nitro server (3 — HTML from route handler)
- [ ] Build systems (2 — Nx, Turborepo host apps)

### 4. CI refactor (separate PR)
- [ ] Matrix builds per example
- [ ] Metadata validation (validate-readmes, templates.json freshness) in PR workflow
- [ ] Release workflow for push-to-main, plugin upgrades, workflow_dispatch

### 5. Build fixes
- [ ] tanstack-start — HTTP 500 (wrangler/cloudflare integration)
- [ ] Nitro examples — verify deploys with zephyr-agent@next

### 6. Coverage gap examples
| Example | ClickUp |
|---------|---------|
| frameworks/vue-vite | [ZE-1253](https://app.clickup.com/t/86ageva9c) |
| frameworks/nuxt | [ZE-1254](https://app.clickup.com/t/86ageva9h) |
| frameworks/nextjs-webpack | [ZE-1255](https://app.clickup.com/t/86ageva9x) |
| frameworks/qwik-vite | [ZE-1256](https://app.clickup.com/t/86agevaau) |
| frameworks/vinext | [ZE-1257](https://app.clickup.com/t/86agevab3) |
| bundlers/react-webpack | [ZE-1258](https://app.clickup.com/t/86agevabb) |

### 7. Web gallery
Gallery MFE consumed by docs site via Module Federation. Blocked on docs site Rspress build failure (`@rspress/core` version conflict).

### 8. create-zephyr CLI
Interactive CLI that fetches templates.json and scaffolds any example via degit. Published to npm. Lives in zephyr-packages.
- [ ] Add category selection step (Bundlers/MFE/Frameworks/Server/Build Systems) before template picker — data already exists via `directory` field in `templates.ts`
- [ ] Update React Native path to use consolidated `frameworks/react-native-*` after standalone repos are archived
