# Angular + Nx + Zephyr Cloud Integration

An Angular application demonstrating Zephyr Cloud integration with Nx workspace management and custom webpack configuration.

## Technology Stack

- **Framework**: Angular with TypeScript
- **Build System**: Nx Workspace
- **Bundler**: Webpack (via Angular CLI)
- **Language**: TypeScript
- **Deployment**: Zephyr Cloud
- **Testing**: Jest + Cypress

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Angular CLI knowledge

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npx nx serve
   ```
   
   The application will be available at `http://localhost:4200`

3. **Build for production**
   ```bash
   npx nx build
   ```

4. **Run tests**
   ```bash
   # Unit tests
   npx nx test
   
   # E2E tests
   npx nx e2e
   ```

5. **Lint the code**
   ```bash
   npx nx lint
   ```

## Special Angular CLI + Zephyr Integration

This example demonstrates the unique setup required for Angular CLI + Zephyr Cloud integration, which is more complex than a simple `withZephyr()` call due to Angular's build process.

### Why the complexity?

Since Angular v8, Angular CLI builds `index.html` outside of the webpack build process:

1. Angular CLI starts webpack build and waits for it to finish
2. Builds `index.html` using `@angular-devkit/build-angular:html`
3. Exits if there are no errors

This means Zephyr's webpack plugin can't directly handle the HTML file.

### Implementation Details

The integration uses two key files:

**1. `extra-webpack.config.js`** - Custom webpack configuration:
```javascript
const { withZephyr } = require('zephyr-webpack-plugin');

// Shorthand for: module.exports = (config) => withZephyr({wait_for_index_html: true})(config);
module.exports = withZephyr({ wait_for_index_html: true });
```

**2. `index-html-transform.js`** - HTML transformation:
```javascript
const { resolveIndexHtml, onDeploymentDone } = require('zephyr-webpack-plugin');

module.exports = async (targetOptions, indexHtml) => {
    resolveIndexHtml(indexHtml);
    await onDeploymentDone();
    return indexHtml;
};
```

**3. `project.json`** configuration uses:
- Custom webpack builder: `@angular-builders/custom-webpack:browser`
- Custom webpack config path: `./extra-webpack.config.js`
- Index transform: `./index-html-transform.js`

## Zephyr Cloud Integration

This example shows how to properly integrate Zephyr Cloud with Angular CLI:

- **Custom webpack config**: Required to inject Zephyr plugin
- **HTML transformation**: Needed to handle index.html outside webpack
- **Deployment waiting**: Ensures Angular CLI waits for Zephyr deployment
- **Automatic deployment**: Triggered on each build

## Project Structure

```
src/
├── app/           # Angular application code
├── assets/        # Static assets
├── index.html     # Main HTML file (transformed by Zephyr)
└── main.ts        # Application bootstrap

Configuration files:
├── extra-webpack.config.js    # Zephyr webpack integration
├── index-html-transform.js    # HTML transformation for Zephyr
└── project.json              # Nx project configuration
```

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

- [Angular Documentation](https://angular.io/docs)
- [Nx Documentation](https://nx.dev/)
- [Angular Builders Custom Webpack](https://github.com/just-jeb/angular-builders/tree/master/packages/custom-webpack)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)
- [Zephyr Angular Integration Guide](https://docs.zephyr-cloud.io/how-to/angular-integration)