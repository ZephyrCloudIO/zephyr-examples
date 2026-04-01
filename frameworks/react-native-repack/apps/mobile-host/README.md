# Host Application

This is the main app, which is a super app.

## Setup

Install dependencies for all apps in root directory of this monorepo:

```
pnpm install
```

Install pods:

```
pnpm pods
```

Pods might sometimes be outdated, and they might fail to install, in that case you can update them by running:

```
pnpm pods:update
```

Create `.env` file in `packages/mobile-sdk` directory with the content of `.env` file from 1password. If you don't have access to 1password, ask Callstack team. Setup environment variables by running from root directory of this monorepo:

```
mobile:env
```

### Run

Start dev server for all apps in root directory of this monorepo:

```
pnpm start
```

Or start dev server for Host app:

```
pnpm start:mobile-host
```

Run iOS or Android app (ios | android):

```
pnpm run:mobile-host:<platform>
```
