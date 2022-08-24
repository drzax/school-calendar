/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
	testDir: 'e2e',
	webServer: {
		command: 'npm run build && npm run preview',
		port: 3000
	}
};

export default config;
