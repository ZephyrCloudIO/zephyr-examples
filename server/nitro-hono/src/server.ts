import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Zephyr from Hono and Nitro!");
});

export default app;
