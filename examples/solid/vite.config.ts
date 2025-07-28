import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { withZephyr } from "vite-plugin-zephyr";

export default defineConfig({
  plugins: [solid(), withZephyr()],
});
