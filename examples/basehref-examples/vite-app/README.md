# BaseHref Vite Example

This example demonstrates the BaseHref functionality in a Vite application, showing how to properly handle base paths for different deployment scenarios.

## Features

- Base path detection and configuration
- HTML base tag injection
- URL construction with proper base path handling
- Runtime base path usage via virtual module
- Support for deploying to non-root paths

## Getting Started

```bash
# Install dependencies
npm install

# Run in development mode with default base
npm run dev

# Run in development mode with /app/ base
npm run dev:base

# Build with default base
npm run build

# Build with /app/ base
npm run build:base

# Preview with default base
npm run preview

# Preview with /app/ base
npm run preview:base
```

## Implementation Details

This example uses the `viteBaseHrefPlugin` to handle base paths in a Vite application:

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteBaseHrefPlugin } from '../../../basehref-vite-plugin';

export default defineConfig({
  plugins: [
    react(),
    viteBaseHrefPlugin({
      enabled: true,
      transformHtml: true,
      baseTagOptions: {
        target: '_blank',
      },
    }),
  ],
});
```

## Using BaseHref in Your Code

The plugin provides a virtual module for accessing the base path in your code:

```typescript
import baseHref from 'virtual:base-href';

// Use the base path for constructing URLs
const imageUrl = new URL('assets/logo.png', baseHref.baseHref).href;
```

## Deployment Considerations

- When deploying to a non-root path, make sure to set the base path in your Vite configuration
- Use the BaseHref plugin to ensure proper path handling
- Use the `virtual:base-href` module for dynamic path resolution at runtime
- Always construct URLs using the base path to ensure proper resolution
