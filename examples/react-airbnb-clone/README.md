# Airbnb Example

This is an Airbnb clone sample based on [another example](https://github.com/AntonioErdeljac/next13-airbnb-clone) made by [Antonio Erdeljac](https://github.com/AntonioErdeljac). ([video](https://www.youtube.com/watch?v=c_-b_isI4vg&t=9493s))

The example was ported from Next.js to vanilla React using React Router for the purposes of showcasing the use of federated components with Zephyr.

To run:

```bash
pnpm i
pnpm dev
```

To build

```bash
# You need to first build the remotes in order for the host to attach them to the application
pnpm build-remotes
pnpm build-host
```
