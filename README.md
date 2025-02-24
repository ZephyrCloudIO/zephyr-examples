# Zephyr Cloud Examples

This repository contains projects demonstrating how to deploy applications to Zephyr Cloud.
A selection of bundlers, frameworks, and patterns are used.

Each example project comes with Zephyr Cloud enabled.
Once you've forked this repository, you can clone it and follow the instructions to [build and deploy](#deploying-an-example-project) to your Zephyr Cloud account.

*   __[`angular-vite`](./examples/angular-vite)__  
    A React application with Module Federation, using Rspack as the bundler.
*   __[`create-default-webpack-mf`](./examples/create-default-webpack-mf)__  
    A React application with Module Federation, using Rspack as the bundler.
*   __[`create-mf-app-rspack`](./examples/create-mf-app-rspack)__  
    A React application using Rspack as the bundler.
*   __[`create-nx-rspack-workpace-mf`](./examples/create-nx-rspack-workpace-mf)__  
    A monorepo using Nx, React, Module Federation, and Rspack as the bundler.
*   __[`create-nx-workspace-mf`](./examples/create-nx-workspace-mf)__  
    A monorepo using Nx, React, Module Federation, and Webpack as the bundler.
*   __[`ng-nx`](./examples/ng-nx)__  
    A monorepo using Nx, Angular v15, and Webpack as the bundler.
*   __[`qwik-1.5`](./examples/qwik-1.5)__  
    A Qwik v1.5 app using Vite as the bundler.
*   __[`react-rspack-tractor-2.0`](./examples/react-rspack-tractor-2.0)__  
    A monorepo using pnpm workspace, React, and Rspack as the bundler.
*   __[`react-tractor-sample`](./examples/react-tractor-sample)__  
    A monorepo using Nx, React, and Webpack as the bundler.
*   __[`react-vite-mf`](./examples/react-vite-mf)__  
    A monorepo using pnpm workspace, Module Federation, React, and Vite as the bundler
*   __[`react-vite-nx`](./examples/react-vite-nx)__  
    A monorepo using Nx, React, and Vite as the bundler
*   __[`turbo-rspack-mf`](./examples/turbo-rspack-mf/)__  
    A monorepo using Turborepo, React, and Rspack as the bundler
*   __[`react-vite-ts`](./examples/react-vite-ts)__  
    A React application built in TypeScript, using Vite as the bundler.
*   __[`rspack-project`](./examples/rspack-project)__  
    A simple Rspack application using React.

## Deploying an example project
After cloning your fork of this repository locally, follow these steps:

1.  __Change directory to the example codebase__  
    For example, if you want to run the `create-default-webpack-mf` example:

    ```shell
    cd ./examples/create-default-webpack-mf
    ```
2.  __Install project dependencies__  
    ```shell
    npm install
    ```
3.  __Build the project__  
    ```shell
    npm run build
    ```

After you build the project, it will be deployed to your Zephyr Cloud account.
For more information on using Zephyr Cloud, visit the [official documentation][documentation].

[documentation]: https://docs.zephyr-cloud.io

## Contributors
![Alt](https://repobeats.axiom.co/api/embed/9d3af925eba49c0dd8ddd8ee144443242fba9b6a.svg "Repobeats analytics image")
