# Module Federation

## How to use

Run the following commands in the root directory.

```bash
yarn
yarn start
```
Both `app1` and `app2` are independently deployed apps:

- `app1`: http://localhost:3001
- `app2`: http://localhost:3002

To be able to use this example, build app2. Then find it in https://app.zephyr-cloud.io and set link to 'remoteEntry.js' file. Link should be set in variable app2Url (/app1/src/index.js).

Check out this link below for more examples:

[https://github.com/module-federation/module-federation-examples](https://github.com/module-federation/module-federation-examples)
