# Zephyr Examples — Next Steps

**PR:** [#139](https://github.com/ZephyrCloudIO/zephyr-examples/pull/139)
**ClickUp:** [ZE-1252](https://app.clickup.com/t/86ageva8x)

---

## What's in PR #139

- Directory restructure: 26 examples in 5 categories (bundlers, module-federation, frameworks, server, build-systems)
- React Native repos consolidated from separate repos
- YAML front matter + templates.json + auto-generated README
- Validation scripts (validate-readmes, generate-templates, generate-readme)
- CONTRIBUTING.md, agents.md
- Matrix CI workflow (development.yml)
- ZephyrWelcome splash page template (`_template/`)

## To merge

- [ ] Squash commits to clean history
- [ ] Fix git author email (CLA bot issue)
- [ ] Review CI — some examples may fail on tanstack-start (HTTP 500) and nitro (zephyr-agent version)

## After merge (same week)

### Link Audit

Old paths (`vanilla/`, `nx/`, `turborepo/`) will 404 after merge. Grep and fix across:

| Repo | Priority |
|------|----------|
| `zephyr-documentation` | High — user-facing docs |
| `zephyr-website` | High — marketing links |
| `zephyr-packages` | Medium — package READMEs |
| `zephyr-cloud-io` | Low — internal |
| `zephyr-mono` | Low — internal |

### Cleanup

- [ ] Add GitHub topics: `zephyr`, `examples`, `module-federation`, `micro-frontends`
- [ ] Add repo description
- [ ] Archive `zephyr-metro-example` and `zephyr-repack-example` with redirect READMEs
- [ ] Handle 84MB GIF in react-native-repack (LFS or removal)
- [ ] Merge stale Renovate PRs

---

## Follow-up PRs

### Branded Splash Pages — [ZE-1265](https://app.clickup.com/t/86agftddz)

Apply `_template/ZephyrWelcome.tsx` Shadow DOM component to all examples. Template and 18 logos are in the repo — needs per-example wiring.

| Scope | Count | Notes |
|-------|-------|-------|
| React bundler examples | 6 | Tested pattern, straightforward |
| MF monorepos | 5 | Target host app in each |
| Non-React frameworks | 4 | Need Angular, Svelte, Solid, Astro wrappers |
| TanStack Start | 1 | React-based |
| Rspress | 1 | SSG, custom page |
| Nitro server | 3 | HTML from route handler |
| Build systems | 2 | Nx, Turborepo host apps |
| React Native | 2 | Skip |

### Coverage Gap Examples

| Example | ClickUp |
|---------|---------|
| `frameworks/vue-vite` | [ZE-1253](https://app.clickup.com/t/86ageva9c) |
| `frameworks/nuxt` | [ZE-1254](https://app.clickup.com/t/86ageva9h) |
| `frameworks/nextjs-webpack` | [ZE-1255](https://app.clickup.com/t/86ageva9x) |
| `frameworks/qwik-vite` | [ZE-1256](https://app.clickup.com/t/86agevaau) |
| `frameworks/vinext` | [ZE-1257](https://app.clickup.com/t/86agevab3) |
| `bundlers/react-webpack` | [ZE-1258](https://app.clickup.com/t/86agevabb) |

### Web Gallery

Gallery MFE (`zephyr-examples/gallery/`) consumed by docs site via Module Federation. Blocked on docs site Rspress build failure.

### CLI Scaffold — `create-zephyr`

Interactive CLI that fetches `templates.json` and scaffolds any example via degit. Separate package in `zephyr-packages`.

### Release Workflow

`development.yml` only handles PRs. Need a release workflow for push-to-main, plugin upgrades, and `workflow_dispatch` builds.
