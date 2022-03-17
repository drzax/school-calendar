module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: [/^svelte-[\d\w]+$/],

	theme: {
		extend: {}
	},
	plugins: [require('@tailwindcss/typography')]
};
