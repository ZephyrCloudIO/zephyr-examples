# Zephyr Cloud Examples

This is the official repository for Zephyr Cloud Examples. It contains a set of examples that demonstrate how to use Zephyr Cloud to build microfrontend applications and deploy them to our cloud services.

### Repository structure

The repository is structured as follows:

```
- examples
├ nx                   (A folder containing all nx examples)
│ └ nx-nextjs-12         (A complete nx workspace containing nextjs@12+ examples)
│   ├ template           (A folder added to group all apps from the sample)
│   │ ├ host             (A nextjs@12+ host app)
│   │ ├ remote           (A nextjs@12+ remote app)
│   │ ├ project.json     (Nx project file to run all apps at once)
│   │ └ README.md        (A readme file to explain how to run the sample and deploy it using Zephyr)
│   nx-nextjs-13         (A complete nx workspace containing nextjs@13+ examples)
│   ├ template           (A folder added to group all apps from the sample)
│   │ ├ host             (A nextjs@13+ host app)
│   │ ├ remote           (A nextjs@13+ remote app)
│   │ ├ project.json     (Nx project file to run all apps at once)
│   │ └ README.md        (A readme file to explain how to run the sample and deploy it using Zephyr)
│   nx-angular
│   nx-modernjs
│   nx-quik
│   nx-svelte
└   nx-vue
...
```

## Base Examples Coverage

The main goal of this repository is to provide a set of examples that demonstrate how to use Zephyr Cloud to build microfrontend applications and deploy them to our cloud services.

The following table shows the base examples that are available in the repository:

| Status | Example                                                                                 |
| ------ | --------------------------------------------------------------------------------------- |
| ❌     | Versioned Layouts (header, footer, body)                                                |
| ❌     | SSR & CSR blended                                                                       |
| ❌     | A/B Testing                                                                             |
| ❌     | Geo based Microfrontends                                                                |
| ❌     | Logging & Errors                                                                        |
| ❌     | Demonstrating pushing error from remote, but having it visible by host (Sentry support) |

## Combined Examples

Considering the base examples above, the following table shows the different combinations of frameworks, bundlers, and package managers that are available in the examples:

| Status | Framework        | Build Tool | Monorepo Tool |
| ------ | ---------------- | ---------- | ------------- |
| ❌     | React            | Webpack    | Nx            |
| ❌     | React            | Rspack     | Nx            |
| ❌     | React            | Vite       | Nx            |
| ❌     | React            | Webpack    | Rush          |
| ❌     | React            | Rspack     | Rush          |
| ❌     | React            | Vite       | Rush          |
| ❌     | NextJS (App Dir) | Webpack    | Nx            |
| ❌     | NextJS (App Dir) | Rspack     | Nx            |
| ❌     | NextJS (App Dir) | Vite       | Nx            |
| ❌     | NextJS (App Dir) | Webpack    | Rush          |
| ❌     | NextJS (App Dir) | Rspack     | Rush          |
| ❌     | NextJS (App Dir) | Vite       | Rush          |
| ❌     | NextJS (RSC)     | Webpack    | Nx            |
| ❌     | NextJS (RSC)     | Rspack     | Nx            |
| ❌     | NextJS (RSC)     | Vite       | Nx            |
| ❌     | NextJS (RSC)     | Webpack    | Rush          |
| ❌     | NextJS (RSC)     | Rspack     | Rush          |
| ❌     | NextJS (RSC)     | Vite       | Rush          |
| ❌     | ModernJS         | Webpack    | Nx            |
| ❌     | ModernJS         | Rspack     | Nx            |
| ❌     | ModernJS         | Vite       | Nx            |
| ❌     | ModernJS         | Webpack    | Rush          |
| ❌     | ModernJS         | Rspack     | Rush          |
| ❌     | ModernJS         | Vite       | Rush          |
| ❌     | Angular          | Webpack    | Nx            |
| ❌     | Angular          | Rspack     | Nx            |
| ❌     | Angular          | Vite       | Nx            |
| ❌     | Angular          | Webpack    | Rush          |
| ❌     | Angular          | Rspack     | Rush          |
| ❌     | Angular          | Vite       | Rush          |
| ❌     | Vue              | Webpack    | Nx            |
| ❌     | Vue              | Rspack     | Nx            |
| ❌     | Vue              | Vite       | Nx            |
| ❌     | Vue              | Webpack    | Rush          |
| ❌     | Vue              | Rspack     | Rush          |
| ❌     | Vue              | Vite       | Rush          |
| ❌     | Qwik             | Webpack    | Nx            |
| ❌     | Qwik             | Rspack     | Nx            |
| ❌     | Qwik             | Vite       | Nx            |
| ❌     | Qwik             | Webpack    | Rush          |
| ❌     | Qwik             | Rspack     | Rush          |
| ❌     | Qwik             | Vite       | Rush          |
