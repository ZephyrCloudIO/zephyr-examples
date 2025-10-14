# BaseHref Examples

This directory contains example applications demonstrating the BaseHref functionality implemented in the Zephyr packages project. These examples show how to properly handle base paths for different deployment scenarios across various bundlers.

## Examples

### Vite Example

A React application built with Vite, demonstrating:

- Base path detection and configuration
- HTML base tag injection
- URL construction with proper base path handling
- Runtime base path usage via virtual module
- Support for deploying to non-root paths

[View Vite Example](./vite-app)

### Webpack Example

A React application built with Webpack, demonstrating:

- Public path detection and configuration
- HTML base tag injection
- URL construction with proper base path handling
- Runtime base path usage via global variable
- Manifest file generation with path information
- Support for deploying to non-root paths

[View Webpack Example](./webpack-app)

## Functionality Overview

The BaseHref implementation provides a consistent way to handle application paths across different bundlers and deployment scenarios. It ensures proper path resolution for applications deployed to non-root paths or using CDNs.

### Key Features

1. **Path Normalization**: Consistent handling of paths across different formats (relative, absolute, URLs)
2. **Bundler Integration**: Support for Vite, Webpack, and Rspack configurations
3. **URL Construction**: Intelligent URL building with base path consideration
4. **Runtime Detection**: Client-side detection of base paths
5. **HTML Generation**: Proper HTML base tag handling

## Usage

Each example includes detailed instructions on how to:

1. Install dependencies
2. Run the application with different base paths
3. Build the application for production
4. Test the built application

## Deployment Considerations

When deploying applications to non-root paths (e.g., `/app/` instead of `/`), proper base path handling is critical for:

- Loading JavaScript and CSS files
- Resolving image and asset URLs
- Making API requests
- Client-side navigation
- Deep linking to routes

These examples demonstrate best practices for handling these scenarios across different bundlers.
