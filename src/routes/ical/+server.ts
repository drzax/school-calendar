import type { Dayjs } from 'dayjs';
import { error } from '@sveltejs/kit';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import { Categories, YearLevels } from '$lib/types.d';
import { filterCalendarData, getCalendarData } from '$lib/utils';
import type { RequestHandler } from '@sveltejs/kit';
import ics from 'ics';
import { CALENDAR_ID } from '$lib/constants';
dayjs.extend(utc);
// dayjs.extend(toArray);

enum DateArrayPrecision {
	DAY = 3,
	HOUR = 4,
	MINUTE = 5
}

const getDateArray = (date: Dayjs, precision: DateArrayPrecision): ics.DateArray => {
	const res = date
		.format('YYYY-MM-DD-H-m')
		.split('-')
		.map((d) => +d)
		.slice(0, precision) as ics.DateArray;

	return res;
};

export const GET: RequestHandler = async ({ url: { searchParams: query } }) => {
	const years =
		query.get('years')?.split('|').map(parseInt) ||
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
			const start = getDateArray(startObj, allDay ? 3 : 5);
			const end = getDateArray(endObj, allDay ? 3 : 5);

			return {
				start,
				end,
				title: title,
				location: location,
				description: description,
				calName: 'School Calendar',
				startOutputType: 'local',
				endOutputType: 'local'
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
