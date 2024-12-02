# Zephyr Cloud Starter

This is an official starter for Zephyr Cloud.

## Using this example

Run the following command:

```sh
npx create-turbo@latest --example https://github.com/swalker326/ze-starter-turbo
```
## Running this example
For zephyr, a couple things have to happen, 
- Publish the project to github (or any other git provider)
  - Public or private, we just care about the git history
- The remote applications need to be built first, which is handled by turbo so all you have to do is:
``` bash
turbo run build
```


## What's inside?

This Turborepo includes the following packages/apps:

### Apps and Packages

Rspack Applications
- `host`: An rspack application and also the host app
- `home`: Another rspack application with module federation setup being consumed by the host
- `settings`: A final rspack application used to highlight the routing (react router)
- `@repo/tailwind-config`: global `tailwind` configurations 
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [Biomejs](https://biomejs.dev/guides/getting-started/) for formatting and linting

### Build

To build all apps and packages, run the following command:

```
cd my-turborepo
pnpm build
```

### Develop

To develop all apps and packages, run the following command:

```
cd my-turborepo
pnpm dev
```

### Remote Caching

Turborepo can use a technique known as [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching) to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo will cache locally. To enable Remote Caching you will need an account with Vercel. If you don't have an account you can [create one](https://vercel.com/signup), then enter the following commands:

```
cd my-turborepo
npx turbo login
```

This will authenticate the Turborepo CLI with your [Vercel account](https://vercel.com/docs/concepts/personal-accounts/overview).

Next, you can link your Turborepo to your Remote Cache by running the following command from the root of your Turborepo:

```
npx turbo link
```

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
