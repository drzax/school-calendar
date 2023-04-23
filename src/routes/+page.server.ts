import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getCalendarData } from '$lib/utils';
import { CALENDAR_ID } from '$lib/constants';

export const load: PageServerLoad = async () => {
	try {
		return { calendar: await getCalendarData() };
	} catch (e) {
		throw error(500, 'Could not load calendar data');
	}
};
