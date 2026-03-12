import { Elysia } from "elysia";
import { CloudflareAdapter } from "elysia/adapter/cloudflare-worker";

const app = new Elysia({
  adapter: CloudflareAdapter,
});

app.get("/", () => "Hello, Elysia with Nitro!");

export default app.compile();
