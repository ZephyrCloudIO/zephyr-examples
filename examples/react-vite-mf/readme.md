# Vite Host + Vite Remote + Rspack Remote + Webpack Remote 

[Documentation](https://docs.zephyr-cloud.io/recipes/vite-rspack-webpack-mf) for this example.

![image](./image.png)

To run this example:

In `zephyr-mono`'s root directory, run each command in succession:

```
pnpm i
pnpm --filter vite-remote run build
pnpm --filter vite_rspack run build
pnpm --filter vite_webpack run build
pnpm --filter vite-host run build
```
