# Qwik + Vite Application ⚡️

A Qwik application built with QwikCity and Vite, demonstrating resumable JavaScript and optimal performance with edge deployment capabilities.

## Technology Stack

- **Framework**: Qwik 1.5 with QwikCity
- **Bundler**: Vite 5
- **Language**: TypeScript
- **Routing**: File-based routing with QwikCity
- **Deployment**: Netlify Edge Functions + Zephyr Cloud
- **Features**: SSR, SSG, Edge Functions

## Prerequisites

- Node.js (version 18.17.0, 20.3.0, or >=21.0.0)
- pnpm (recommended) or npm

## Getting Started

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development server**
   ```bash
   pnpm dev
   # or pnpm start
   ```
   
   The application will be available at `http://localhost:5173`

3. **Build for production**
   ```bash
   pnpm build
   ```

4. **Preview production build**
   ```bash
   pnpm preview
   ```

## Project Structure

This project uses QwikCity for enhanced routing and site features:

```
├── public/          # Static assets
├── src/
│   ├── components/  # Reusable components
│   └── routes/      # File-based routing
└── netlify.toml     # Netlify configuration
```

- **`src/routes/`**: Directory-based routing with layouts and pages
- **`src/components/`**: Recommended directory for reusable components
- **`public/`**: Static assets served directly

## Zephyr Cloud Integration

This example is configured to deploy to Zephyr Cloud automatically when built, while also supporting Netlify Edge Functions for optimal edge deployment.

## About Qwik

Qwik is a new framework that offers:
- **Resumable JavaScript**: No hydration, instant interactivity
- **Fine-grained lazy loading**: Load only what's needed
- **Zero JavaScript by default**: HTML-first approach
- **Edge-optimized**: Perfect for edge deployments

## Netlify Deployment

This project is configured for Netlify Edge Functions:

1. **Local development with Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   pnpm build
   netlify dev
   ```

2. **Deploy to Netlify**:
   ```bash
   netlify deploy --build --prod
   ```

## Available Integrations

Add additional integrations using:
```bash
pnpm qwik add
```

Available options include:
- Cloudflare Workers
- Netlify Edge Functions
- Express Server
- Static Site Generation (SSG)

## About Zephyr Cloud

Zephyr Cloud is a micro-frontend deployment platform that provides:
- **Auto-deployment**: Seamless deployment from your build process
- **Live preview links**: Instant preview URLs for your applications
- **SemVer versioning**: Semantic versioning for your frontend modules
- **Rollback capabilities**: Easy rollback to previous versions
- **Enterprise-scale orchestration**: Built for composable frontend systems

## Learn More

- [Qwik Documentation](https://qwik.dev/)
- [QwikCity Guide](https://qwik.dev/qwikcity/overview/)
- [Qwik Discord Community](https://qwik.dev/chat)
- [Vite Documentation](https://vitejs.dev/)
- [Netlify Edge Functions](https://docs.netlify.com/edge-functions/overview/)
- [Zephyr Cloud Documentation](https://docs.zephyr-cloud.io)

