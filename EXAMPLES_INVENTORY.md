# Examples Inventory & Standardization Plan

This document catalogs all examples across the three directories (vanilla, nx, turborepo) and identifies standardization opportunities.

## Current Inventory

### Vanilla (23 examples)
1. angular-vite
2. basehref-examples
3. create-default-webpack-mf
4. create-mf-app-rspack
5. ember-vite
6. modernjs-app
7. ng-mf
8. parcel-react
9. plugin-testing
10. qwik-1.5
11. react-airbnb-clone
12. react-rollup-ts
13. react-rspack-tractor-2.0
14. react-tractor-sample
15. react-vite-mf
16. react-vite-ts
17. rolldown-react
18. rspack-project
19. rspress-ssg
20. solid
21. svelte
22. tsdown
23. vitepress

### NX (4 examples)
1. create-nx-rspack-workspace-mf
2. create-nx-workspace-mf
3. nx-ng
4. react-vite-nx

### Turborepo (1 example)
1. turbo-rspack-mf

---

## Categorization by Technology

### React Examples

#### Vanilla
- `create-default-webpack-mf` - React + Webpack + Module Federation
- `create-mf-app-rspack` - React + Rspack + (likely MF)
- `react-airbnb-clone` - React + Rspack + Module Federation
- `react-rollup-ts` - React + Rollup + TypeScript
- `react-rspack-tractor-2.0` - React + Rspack (monorepo)
- `react-tractor-sample` - React + Webpack (monorepo)
- `react-vite-mf` - React + Vite + Module Federation
- `react-vite-ts` - React + Vite + TypeScript
- `rolldown-react` - React + Rolldown
- `rspack-project` - React + Rspack

#### NX
- `create-nx-rspack-workspace-mf` - React + Rspack + Module Federation + NX
- `create-nx-workspace-mf` - React + Webpack + Module Federation + NX
- `react-vite-nx` - React + Vite + NX

#### Turborepo
- `turbo-rspack-mf` - React + Rspack + Module Federation + Turborepo

### Angular Examples

#### Vanilla
- `angular-vite` - Angular + Vite
- `ng-mf` - Angular + Module Federation

#### NX
- `nx-ng` - Angular v15 + Webpack + NX

### Other Frameworks

#### Vanilla
- `solid` - SolidJS
- `svelte` - Svelte
- `qwik-1.5` - Qwik
- `ember-vite` - Ember + Vite

### Bundler/Build Tool Examples

#### Vanilla
- `parcel-react` - Parcel bundler
- `modernjs-app` - ModernJS framework
- `rspress-ssg` - Rspress SSG
- `vitepress` - VitePress documentation
- `rolldown-react` - Rolldown bundler
- `tsdown` - TypeScript bundler

### Utility/Testing Examples

#### Vanilla
- `basehref-examples` - Base href examples
- `plugin-testing` - Plugin testing utilities

---

## Standardization Opportunities

### ✅ Already Standardized Across All Three

**React + Rspack + Module Federation**
- ✅ Vanilla: `turbo-rspack-mf` equivalent exists as multiple examples
- ✅ NX: `create-nx-rspack-workspace-mf`
- ✅ Turborepo: `turbo-rspack-mf`

### 🎯 Should Be Standardized (High Priority)

#### 1. React + Vite + TypeScript (Simple)
- ✅ Vanilla: `react-vite-ts`
- ✅ NX: `react-vite-nx`
- ❌ Turborepo: **MISSING** - Should add `turbo-react-vite`

#### 2. React + Webpack + Module Federation
- ✅ Vanilla: `create-default-webpack-mf`
- ✅ NX: `create-nx-workspace-mf`
- ❌ Turborepo: **MISSING** - Should add `turbo-webpack-mf`

#### 3. Angular + Vite
- ✅ Vanilla: `angular-vite`
- ✅ NX: `nx-ng` (uses Webpack, should add Vite version)
- ❌ Turborepo: **MISSING** - Should add `turbo-angular-vite`

#### 4. React + Rspack (Simple, no MF)
- ✅ Vanilla: `rspack-project`
- ❌ NX: **MISSING** - Should add `nx-rspack-simple`
- ❌ Turborepo: **MISSING** - Should add `turbo-rspack-simple`

### 🔄 Framework Diversity (Medium Priority)

#### 5. SolidJS
- ✅ Vanilla: `solid`
- ❌ NX: **MISSING** - Should add `nx-solid`
- ❌ Turborepo: **MISSING** - Should add `turbo-solid`

#### 6. Svelte
- ✅ Vanilla: `svelte`
- ❌ NX: **MISSING** - Should add `nx-svelte`
- ❌ Turborepo: **MISSING** - Should add `turbo-svelte`

### 📚 Advanced Patterns (Lower Priority)

#### 7. React + Rollup
- ✅ Vanilla: `react-rollup-ts`
- ❌ NX: **MISSING**
- ❌ Turborepo: **MISSING**

#### 8. React + Rolldown (Experimental)
- ✅ Vanilla: `rolldown-react`
- ❌ NX: **MISSING**
- ❌ Turborepo: **MISSING**

---

## Proposed Standard Example Set

Each directory should have these core examples:

### Core Set (All Three Directories)

#### React Examples
1. **react-vite-simple** - React + Vite + TypeScript (simple app)
2. **react-vite-mf** - React + Vite + Module Federation
3. **react-webpack-mf** - React + Webpack + Module Federation
4. **react-rspack-simple** - React + Rspack (simple app)
5. **react-rspack-mf** - React + Rspack + Module Federation

#### Angular Examples
6. **angular-vite** - Angular + Vite
7. **angular-webpack-mf** - Angular + Webpack + Module Federation

#### Other Frameworks
8. **solid-vite** - SolidJS + Vite
9. **svelte-vite** - Svelte + Vite

### Extended Set (Vanilla Only)

Keep these specialized examples in vanilla only:
- `qwik-1.5` - Qwik framework
- `ember-vite` - Ember framework
- `parcel-react` - Parcel bundler showcase
- `modernjs-app` - ModernJS framework
- `rolldown-react` - Rolldown bundler (experimental)
- `rspress-ssg` - Rspress SSG
- `vitepress` - VitePress documentation
- `basehref-examples` - Utility examples
- `plugin-testing` - Testing utilities

---

## Migration Action Items

### For NX Directory

**Add:**
1. `nx-rspack-simple` - Simple React + Rspack without MF
2. `nx-solid-vite` - SolidJS example
3. `nx-svelte-vite` - Svelte example

**Rename/Refactor:**
1. `create-nx-workspace-mf` → `nx-react-webpack-mf` (more consistent naming)
2. `create-nx-rspack-workspace-mf` → `nx-react-rspack-mf` (more consistent naming)
3. `react-vite-nx` → `nx-react-vite-simple` (more consistent naming)
4. `nx-ng` → `nx-angular-webpack` (more descriptive)

### For Turborepo Directory

**Add:**
1. `turbo-react-vite-simple` - React + Vite + TypeScript
2. `turbo-react-webpack-mf` - React + Webpack + Module Federation
3. `turbo-react-rspack-simple` - React + Rspack without MF
4. `turbo-angular-vite` - Angular + Vite
5. `turbo-solid-vite` - SolidJS example
6. `turbo-svelte-vite` - Svelte example

**Rename/Refactor:**
1. `turbo-rspack-mf` → `turbo-react-rspack-mf` (more explicit about React)

### For Vanilla Directory

**Rename/Refactor for Consistency:**
1. `react-vite-ts` → `react-vite-simple` (align with other directories)
2. `create-default-webpack-mf` → `react-webpack-mf` (simpler naming)
3. `create-mf-app-rspack` → `react-rspack-mf` (simpler naming)
4. `rspack-project` → `react-rspack-simple` (more descriptive)
5. `react-vite-mf` → Keep as is (already well-named)
6. `angular-vite` → Keep as is (already well-named)
7. `ng-mf` → `angular-webpack-mf` (more descriptive)
8. `solid` → `solid-vite` (include bundler)
9. `svelte` → `svelte-vite` (include bundler)

**Consider Removing/Archiving:**
- `react-tractor-sample` (redundant with other examples)
- `react-rspack-tractor-2.0` (redundant with other examples)
- `react-airbnb-clone` (nice demo but not core)

---

## Naming Convention

Going forward, use this naming pattern:

### For Vanilla:
`{framework}-{bundler}-{feature}`

Examples:
- `react-vite-simple`
- `react-webpack-mf`
- `angular-vite`

### For NX:
`nx-{framework}-{bundler}-{feature}`

Examples:
- `nx-react-vite-simple`
- `nx-react-webpack-mf`
- `nx-angular-vite`

### For Turborepo:
`turbo-{framework}-{bundler}-{feature}`

Examples:
- `turbo-react-vite-simple`
- `turbo-react-webpack-mf`
- `turbo-angular-vite`

**Where:**
- `{framework}` = react, angular, solid, svelte, etc.
- `{bundler}` = vite, webpack, rspack, rollup, etc.
- `{feature}` = simple, mf (module federation), or specific feature

---

## Summary

**Current State:**
- Vanilla: 23 examples (comprehensive but inconsistent naming)
- NX: 4 examples (minimal coverage)
- Turborepo: 1 example (very minimal)

**Standardized State Goal:**
- Vanilla: 9 core + specialized examples (~15-20 total)
- NX: 9 core examples (matching vanilla core set)
- Turborepo: 9 core examples (matching vanilla core set)

**Benefits:**
- ✅ Consistent naming across all three directories
- ✅ Easy to compare same example across different monorepo tools
- ✅ Clear demonstration of each monorepo tool's strengths
- ✅ Reduced confusion for users
- ✅ Easier maintenance and testing
