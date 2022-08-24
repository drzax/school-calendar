import { test, expect } from '@playwright/test';

test('homepage has "School Calendar" in title', async ({ page }) => {
	await page.goto('/');
	await expect(page).toHaveTitle(/School Calendar/);
});

// test('/ical genrates a .ics file', async ({ page }) => {
// 	// await page.goto('http://localhost:4173/');
// 	// await page.locator('text=Filters').click();
// 	// Note that Promise.all prevents a race condition
// 	// between clicking and waiting for the download.
// 	const [download, response] = await Promise.all([
// 		// It is important to call waitForEvent before click to set up waiting.
// 		page.waitForEvent('download'),
// 		page.waitForResponse('webcal://localhost:4173/ical'),
// 		// Triggers the download.
// 		// page.locator('text=Subscribe to this calendar?').click()
// 		await page.goto('http://localhost:4173/ical')
// 	]);
// 	// wait for download to complete
// 	const path = await download.path();

// 	expect(response).not.toBeNull();
// 	if (response) {
// 		expect(await response.headerValues('Content-Type')).toEqual(['text/calendar']);
// 	}
// });
