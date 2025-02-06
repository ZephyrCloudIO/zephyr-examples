import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { withZephyr } from 'vite-plugin-zephyr';

// https://vite.dev/config/
export default defineConfig({
	plugins: [svelte(), withZephyr()],
});
