
Because this is a Micro-frontend application, to run this example, you will need to run below commands in succession: 

```bash
npx nx run team-green:build
npx nx run team-blue:build
npx nx run team-red:build
```

While team-blue and team-red are remote applications, they will need to be built first for Zephyr to map the remote application to team-red(the host app). 

For more details about how to handle Micro-Frontend application you can refer [to the checklist here](https://docs.zephyr-cloud.io/how-to/mf-guide)
