import { error } from '@sveltejs/kit';
import { Categories, YearLevels } from '$lib/types.d';
import { filterCalendarData, getCalendarData } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';
import ics from 'ics';
import { CALENDAR_ID, TIMEZONE } from '$lib/constants';
import { getDateArray, makeDayjsObj } from '$lib/datetime';

export const GET: RequestHandler = async ({ url: { searchParams: query } }) => {
	const years =
		query.getAll('years').map((d) => +d) ||
		Object.values(YearLevels).filter((y): y is number => typeof y === 'number');
	const categories =
		query
			.getAll('categories')
			.filter((d): d is Categories => Object.values(Categories).includes(d as Categories)) ||
		Object.values(Categories);

	const data = filterCalendarData(await getCalendarData(), categories, years);
	const eventsJson: ics.EventAttributes[] = data.map(
		({ allDay, start: startObj, end: endObj, title, location, description }) => {
			const start = getDateArray(makeDayjsObj(startObj), allDay);
			const end = getDateArray(makeDayjsObj(endObj), allDay);
			return {
				start,
				end,
				title: title,
				location: location || undefined,
				description: description || undefined,
				calName: 'School Calendar',
				startInputType: 'utc',
				startOutputType: 'utc',
				endInputType: 'utc',
				endOutputType: 'utc'
			};
		}
	);

	const { error: icsError, value: icsFile } = ics.createEvents(eventsJson);

	if (icsError) {
		throw error(500, 'Error creating ICS file');
	}

	return new Response(icsFile, {
		headers: {
			'Content-Type': 'text/plain'
		}
	});
};
