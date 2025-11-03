import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { withZephyr } from 'vite-plugin-zephyr';

// https://vitejs.dev/config/
export default defineConfig(() => ({
	plugins: [angular(), withZephyr()],
}));
