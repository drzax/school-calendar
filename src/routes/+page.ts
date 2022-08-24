import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getCalendarData } from '$lib/utils';
import { CALENDAR_ID } from '$lib/constants';

export const load: PageLoad = async () => {
	try {
		return { calendar: await getCalendarData(CALENDAR_ID) };
	} catch (e) {
		throw error(500, 'Could not load calendar data');
	}
};
