import type { Dayjs } from 'dayjs';
import { error } from '@sveltejs/kit';
import { Categories, YearLevels } from '$lib/types.d';
import { filterCalendarData, getCalendarData } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';
import ics from 'ics';
import { CALENDAR_ID } from '$lib/constants';

const getDateArray = (date: Dayjs, allDay: boolean): ics.DateArray => {
	return allDay
		? [date.year(), date.month() + 1, date.date()]
		: [
				date.utc().year(),
				date.utc().month() + 1,
				date.utc().date(),
				date.utc().hour(),
				date.utc().minute()
		  ];
};

export const GET: RequestHandler = async ({ url: { searchParams: query } }) => {
	const years =
		query
			.get('years')
			?.split('|')
			.map((d) => +d) ||
		Object.values(YearLevels).filter((y): y is number => typeof y === 'number');
	const categories =
		query
			.get('categories')
			?.split('|')
			.filter((d): d is Categories => Object.values(Categories).includes(d as Categories)) ||
		Object.values(Categories);

	const data = filterCalendarData(await getCalendarData(CALENDAR_ID), categories, years);
	const eventsJson: ics.EventAttributes[] = data.map(
		({ allDay, start: startObj, end: endObj, title, location, description }) => {
			const start = getDateArray(startObj, allDay);
			const end = getDateArray(endObj, allDay);
			return {
				start,
				end,
				title: title,
				location: location,
				description: description,
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
			'Content-Type': 'text/calendar'
		}
	});
};
