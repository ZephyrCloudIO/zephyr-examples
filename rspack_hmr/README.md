# mf-runtime

## How to run this example
First install all by running

```sh
pnpm install && pnpm run install-all
```

After installation run: 
`pnpm run start`

Rspack remotes:
run `host` (localhost:3000) and `app2`

runtime remotes:
run `runhost` (localhost:3003) and `app2`

HMR should work fine in both cases!

## How does it work 

We pay attention to all the `rspack.config.ts` in each of the modules. 

Let's start with `app_02` where it provides the component to others. 

Within  [`app_02`'s `rspack.config.ts`](./app2/rspack.config.js), we expose two things (only one thing is used atm for other hosts)

```js
 new ModuleFederationPlugin({
      name: name,
      filename: 'remoteEntry.js',
      exposes: {
        './Hello': './src/Hello.tsx',
        './pi': './src/pi.ts',
      },
      manifest: true,

    }),
```

The <Hello/> component is exposed from the configuration, while we define a public path (for other consuming application to find it) at: 

```js
  output: {
    path: __dirname + '/dist',
    uniqueName: name1,
    publicPath: 'http://localhost:3001/',
    filename: '[name].js',
  },
```
And of course, often time we run into `CORS` error so we also need to make sure the headers are configured correctly since we will be fetching part of the frontend from `app2` to other host application (in this case, dir name `host` and `runhost`):

```js
headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
```

Next we go into [`host/rspack.config.ts`](./host/rspack.config.js), to consume the remote module from other application we will need: 
1. the app's unique name `app_02`
2. the public path (at the moment it runs on your local computer)
3. the module federation manifest
4. specify if there is any shared dependencies

This part of the code is how `host` can find `app2`:

```js
 new ModuleFederationPlugin({
      name: name,
      filename: 'remoteEntry.js',
      remotes: {
        app_02: 'app_02@http://localhost:3001/mf-manifest.json',
      },

      shared: ['react', 'react-dom'],
    }),
```

When we are going to consume the `Hello` module from `app2`, we find the [`host/src/App.tsx`](./host/src/App.tsx) and import it just like every other React component with a path we have defined in `rspack.config.ts`: 

```tsx
import { Hello } from 'app_02/Hello';

```
and then within the component: 
```tsx
...
 <div className="logo">
          <img
            className="w-10 just"
            src="https://cdn.builder.io/api/v1/image/assets%2Fea8c8e416fd64171bc2ef9ac5ac226e6%2Fa079d11fa8c944439878233232acc4b5"
          ></img>
        </div>

        <Hello name={'bobzz'} />
      </div>
...
```
