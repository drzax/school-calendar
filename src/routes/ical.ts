import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import toArray from 'dayjs/plugin/toArray';
import { Categories } from '$lib/types.d';
import { filterCalendarData, getCalendarData } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';
import * as pkg from 'ics';
const { createEvents } = pkg;
dayjs.extend(utc);
dayjs.extend(toArray);

export const get: RequestHandler = async ({ query }) => {
	const years = query.get('years').split('|').map(parseInt);
	const categories = query
		.get('categories')
		.split('|')
		.filter((d) => Object.values(Categories).includes(d as Categories)) as Categories[];

	const data = filterCalendarData(await getCalendarData('153'), categories, years);
	const eventsJson = data.map(
		({ allDay, start: startObj, end: endObj, title, location, description }) => {
			const start = startObj
				.utc()
				.toArray()
				.slice(0, allDay ? 3 : 5)
				.map((d, i) => (i === 1 ? d + 1 : d)) as pkg.DateArray;
			const end = endObj
				.utc()
				.toArray()
				.slice(0, allDay ? 3 : 5)
				.map((d, i) => (i === 1 ? d + 1 : d)) as pkg.DateArray;

			return {
				start,
				end,
				title: title,
				location: location,
				description: description,
				calName: 'School Calendar'
			};
		}
	);

	const { error, value: ics } = createEvents(eventsJson);

	return error ? { error } : { body: ics, headers: { 'Content-Type': 'text/calendar' } };
};
