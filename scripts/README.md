# Scripts to help validate Canary and Next tag builds

Upgrade all plugins
```bash
pnpm upgrade-plugins v0.0.50
```

Build all projects
```bash
rm -rf ~/.zephyr # Optional (clear cache to show only deployed URL's from this run instead of all deployed from this cache)
pnpm build-packages
```

Output of URL's will be seen.  
Access them to validate the deployments.

Upgrade and build logs will be under `scripts/tmp/{action}/{timestamp}/{project}.txt`.
