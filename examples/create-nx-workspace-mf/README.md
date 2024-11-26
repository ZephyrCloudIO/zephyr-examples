
Because this is a Micro-frontend application, to run this example, you will need to run below commands in succession: 

```bash
npx nx run remote1:build
npx nx run remote2:build
npx nx run shell:build
```

While `remote1` and `remote2` are remote applications, they will need to be built first for Zephyr to map the remote application to shell(the host app). 

For more details about how to handle Micro-Frontend application you can refer [to the checklist here](https://docs.zephyr-cloud.io/how-to/mf-guide)
