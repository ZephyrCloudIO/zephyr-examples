# Module Federation

## How to use

Run the following commands in the root directory.

```bash
yarn
yarn start
```
To be able to build `app1` set `app2Url` variable in file app1/src/index.js. There should be the lint to the `remoteEntry.js` file for remote `default_webpack_mf_second`.
Both `app1` and `app2` are independently deployed apps:

- `app1`: http://localhost:3001
- `app2`: http://localhost:3002


Check out this link below for more examples:

[https://github.com/module-federation/module-federation-examples](https://github.com/module-federation/module-federation-examples)
