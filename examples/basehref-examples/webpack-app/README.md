# BaseHref Webpack Example

This example demonstrates the BaseHref functionality in a Webpack application, showing how to properly handle base paths for different deployment scenarios.

## Features

- Public path detection and configuration
- HTML base tag injection
- URL construction with proper base path handling
- Runtime base path usage via global variable
- Manifest file generation with path information
- Support for deploying to non-root paths

## Getting Started

```bash
# Install dependencies
npm install

# Run in development mode with default public path
npm run start

# Run in development mode with /app/ public path
npm run start:base

# Build with default public path
npm run build

# Build with /app/ public path
npm run build:base
```

## Implementation Details

This example uses the `webpackBaseHrefPlugin` to handle base paths in a Webpack application:

```javascript
// webpack.config.js
const { webpackBaseHrefPlugin } = require('../../../basehref-webpack-plugin');

module.exports = (env = {}) => {
  // Extract publicPath from environment
  const publicPath = env.publicPath || 'auto';

  return {
    // Webpack configuration...
    plugins: [
      // Other plugins...
      webpackBaseHrefPlugin({
        publicPath: publicPath,
        injectIntoHtml: true,
        generateManifestFile: true,
      }),
    ],
  };
};
```

## Using BaseHref in Your Code

The plugin exposes the base path as a global variable in the browser:

```typescript
// Access the base path in your code
const basePath = window.__BASEHREF__;

// Use it for constructing URLs
const imageUrl = new URL('assets/image.jpg', basePath).href;
```

## Deployment Considerations

- When deploying to a non-root path, make sure to set the publicPath in your Webpack configuration
- Use the BaseHref plugin to ensure proper path handling
- Use the window.**BASEHREF** global variable for dynamic path resolution at runtime
- Always construct URLs using the base path to ensure proper resolution
- Check the generated basehref-manifest.json file for path configuration details
