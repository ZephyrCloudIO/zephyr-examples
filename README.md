# Zephyr Cloud Examples

This is the official repository for Zephyr Cloud Examples. It contains a set of examples that demonstrate how to use Zephyr Cloud to build microfrontend applications and deploy them to our cloud services.

### Repository structure

The repository is structured as follows:

```
- examples
├ nx-nextjs-12         (A complete nx workspace containing nextjs@12+ examples)
│ └ template           (A folder added to group all apps from the sample)
│   ├ host             (A nextjs@12+ host app)
│   ├ remote           (A nextjs@12+ remote app)
│   ├ project.json     (Nx project file to run all apps at once)
│   └ README.md        (A readme file to explain how to run the sample and deploy it using Zephyr)
├ nx-nextjs-13         (A complete nx workspace containing nextjs@13+ examples)
│ └ template           (A folder added to group all apps from the sample)
│   ├ host             (A nextjs@13+ host app)
│   ├ remote           (A nextjs@13+ remote app)
│   ├ project.json     (Nx project file to run all apps at once)
│   └ README.md        (A readme file to explain how to run the sample and deploy it using Zephyr)
├ nx-angular
├ nx-quik
├ nx-svelte
└ nx-vue
...
```
