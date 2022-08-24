import type { PageLoad } from '@sveltejs/kit';
import { Categories, YearLevels } from '$lib/types.d';
import { getCalendarData } from '$lib/utils';
import { CALENDAR_ID } from '$lib/constants';

export const load: PageLoad = async ({ fetch }) => {
	try {
		return { calendar: await getCalendarData(CALENDAR_ID) };
	} catch (error) {
		throw new Error("@migration task: Migrate this return statement (https://github.com/sveltejs/kit/discussions/5774#discussioncomment-3292693)");
		return { error };
	}
};
