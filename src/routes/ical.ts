import { Categories } from '$lib/types.d';
import { filterCalendarData, getCalendarData } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';
import pkg from 'ics';
const { createEvents } = pkg;

export const get: RequestHandler = async ({ query }) => {
	const years = query.get('years').split('|').map(parseInt);
	const categories = query
		.get('categories')
		.split('|')
		.filter((d) => Object.values(Categories).includes(d as Categories)) as Categories[];

	const data = filterCalendarData(await getCalendarData('153'), categories, years);

	const { error, value: ics } = createEvents(
		data.map((d) => ({
			start: [d.start.year(), d.start.month() + 1, d.start.date()],
			end: [d.end.year(), d.end.month() + 1, d.end.date()],
			title: d.title,
			description: d.description,
			calName: 'School Calendar'
		}))
	);

	return error ? { error } : { body: ics };
};
