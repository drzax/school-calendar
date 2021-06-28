import preprocess from 'svelte-preprocess';
import netlify from '@sveltejs/adapter-netlify';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: netlify(),
		target: '#svelte',
		vite: {
			optimizeDeps: {
				include: ['ics'] // 👈
			}
		}
	}
};

export default config;
