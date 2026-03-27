# Contributing to Zephyr Examples

## Adding a New Example

### 1. Decide where it goes

| Your example is... | Category |
|---------------------|----------|
| Zephyr + bundler setup (no MF) | `bundlers/` |
| Uses Module Federation | `module-federation/` |
| Non-React framework (Angular, Solid, etc.) or React Native | `frameworks/` |
| Server-side / edge | `server/` |
| Build system integration (Nx, Turborepo) | `build-systems/` |

### 2. Naming rules

- **Format:** `{framework}-{bundler}` (e.g., `react-vite`, `angular-rspack`)
- **kebab-case only** — no camelCase, no underscores
- **No category prefix** — the folder provides context
  (`module-federation/react-rspack` not `module-federation/mf-react-rspack`)
- **Demo apps:** use a descriptive name (`airbnb-clone`, `tractor-sample`)

### 3. Required files

Every example MUST have:

| File | Purpose |
|------|---------|
| `README.md` | YAML front matter + docs (see template below) |
| `package.json` | Standard scripts: `dev`, `build` at minimum |
| `.gitignore` | At minimum: `node_modules`, `dist`, `.env` |
| Zephyr config | `zephyr.config.ts` or bundler plugin setup |

### 4. README front matter (required)

```yaml
---
name: Human-Readable Name
slug: category/directory-name    # must match actual path
description: One line, max 140 chars
framework: react                  # see allowed values below
bundler: vite                     # see allowed values below
features: [module-federation]     # optional, see allowed values
complexity: beginner              # beginner | intermediate | advanced
---
```

**Allowed values:**
- `framework`: react, angular, solid, svelte, ember, astro, tanstack, nitro, qwik, vue
- `bundler`: vite, webpack, rspack, rsbuild, rollup, rolldown, metro, repack, turbopack, parcel, tsdown, nitro
- `features`: module-federation, ssr, ssg, edge, monorepo, typescript

### 5. README body structure

```markdown
# {name}

> One-line description (same as front matter `description`).

## Tech Stack
- Bullet list of key technologies

## Quick Start
\```bash
npx degit ZephyrCloudIO/zephyr-examples/{slug} my-app
cd my-app
pnpm install
pnpm dev
\```

## What's Inside
Brief architecture explanation. What Zephyr does here.

## Deploy
\```bash
pnpm build    # Builds and deploys to Zephyr Cloud
\```

## Learn More
- [Zephyr Cloud Docs](https://docs.zephyr-cloud.io)
```

### 6. Code standards

- TypeScript preferred over JavaScript
- Use the Zephyr bundler plugin for your bundler
- Keep examples minimal — demonstrate one concept clearly
- No custom CSS frameworks — vanilla CSS or Tailwind only
- Pin major versions of Zephyr plugins (don't use `latest`)

### 7. What NOT to do

- Create a new top-level category without discussion
- Add examples that don't integrate with Zephyr Cloud
- Use non-standard script names (`start` instead of `dev`)
- Include `.env` files with real tokens
- Add examples that duplicate existing ones without clear differentiation
- Skip README front matter — CI will reject your PR
- Manually edit `templates.json` or root `README.md` — both are auto-generated

### 8. PR checklist

- [ ] Example is in the correct category folder
- [ ] Directory name follows `{framework}-{bundler}` convention
- [ ] `README.md` has valid YAML front matter with all required fields
- [ ] `slug` in front matter matches actual directory path
- [ ] `pnpm install && pnpm dev` works locally
- [ ] `pnpm build` succeeds
- [ ] No secrets or tokens in committed files
- [ ] CI passes (lint, build, README validation)
