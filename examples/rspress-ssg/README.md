# Rspress Static Site Generator

A documentation website built with Rspress, demonstrating static site generation with modern tooling and fast performance.

## Technology Stack

- **Framework**: Rspress (React-based SSG)
- **Bundler**: Rspack (built-in)
- **Language**: TypeScript
- **Content**: Markdown with MDX support
- **Deployment**: Zephyr Cloud
- **Features**: Static site generation, Hot reload, Theme customization

## Prerequisites

- Node.js (version 16 or higher)
- pnpm (recommended) or npm

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   ```
   
   The documentation site will be available with hot reload

3. **Build for production**
   ```bash
   pnpm build
   ```
   
   Generates optimized static files in the `dist` directory

4. **Preview production build**
   ```bash
   pnpm preview
   ```

## Project Structure

Rspress uses a content-driven architecture:

```
├── docs/                    # Documentation content
│   ├── _meta.json          # Navigation configuration
│   ├── index.md            # Home page
│   ├── hello.md            # Example page
│   ├── guide/              # Guide section
│   │   ├── _meta.json      # Section navigation
│   │   └── index.md        # Guide content
│   └── public/             # Static assets
├── rspress.config.ts       # Rspress configuration
└── tsconfig.json          # TypeScript configuration
```

## Zephyr Cloud Integration

This example demonstrates static site deployment with Zephyr Cloud, showing how documentation and marketing sites can be efficiently deployed and versioned.

## About Rspress

Rspress is a static site generator built on Rspack that provides:
- **Lightning fast**: Built with Rust-based Rspack for fast builds
- **React-based**: Leverage React ecosystem and components
- **MDX support**: Write content in Markdown with React components
- **Theme system**: Customizable themes and layouts
- **Plugin architecture**: Extensible with plugins
- **TypeScript**: Full TypeScript support out of the box

## Content Management

- Write content in Markdown files within the `docs/` directory
- Use `_meta.json` files to configure navigation and page order
- Add static assets to `docs/public/` for images and other files
- Customize the site configuration in `rspress.config.ts`

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

- [Rspress Documentation](https://rspress.dev/)
- [Rspack Documentation](https://rspack.dev/)
- [MDX Documentation](https://mdxjs.com/)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)
