/// <reference types="vitest" />

// vite.config.js
import { sveltekit } from '@sveltejs/kit/vite';
import { configDefaults } from 'vitest/config';

/** @type {import('vite').UserConfig} */
const config = {
	plugins: [sveltekit()],
	optimizeDeps: {
		include: ['dayjs']
	},
	test: {
		exclude: [...configDefaults.exclude, 'tests/**']
	}
};

export default config;
