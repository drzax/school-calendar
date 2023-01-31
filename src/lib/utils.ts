import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import { Categories, YearLevels } from '$lib/types.d';
import type { CalendarEntry } from '$lib/types.d';
import { z } from 'zod';
import { TIMEZONE } from './constants';
import { browser } from '$app/environment';
import { selectedCategories, selectedYearLevels } from '$lib/storage';
import { get } from 'svelte/store';

dayjs.extend(utc);
dayjs.extend(timezone);

const APICalendarFormat = z.object({
	id: z.string(),
	title: z.string(),
	start: z.string(),
	end: z.string(),
	description: z.string(),
	location: z.string(),
	allDay: z.string(),
	category: z.string(),
	backgroundColor: z.string(),
	textColor: z.string(),
	sdate: z.string(),
	stime: z.string(),
	edate: z.string(),
	etime: z.string()
});

type APICalendarFormat = z.infer<typeof APICalendarFormat>;

export const inferYears = (title: string): number[] => {
	const years: number[] = [];
	[...title.matchAll(/(year|yr)\s?([1-6])(\s?-\s?([1-6]))?/gi)].forEach((d) => {
		const start = +d[2];
		years.push(start);
		const end = +d[4];

		if (end && end > start) {
			for (let i = start + 1; i <= end; i++) {
				years.push(i);
			}
		}
	});

	[...title.matchAll(/(year|yr)([\s,&]+([1-6])){2,}/gi)].forEach(([match]) => {
		match.split('').forEach((d) => {
			if (Number.isInteger(+d) && +d < 7 && +d > 0) years.push(+d);
		});
	});

	[...title.matchAll(/prep\s?-\s?([1-6])/gi)].forEach(([match, endYear]) => {
		for (var i = 0; i <= +endYear; i++) {
			years.push(i);
		}
	});

	// This is a special case for year six activities about preparation for year 7
	if (title.match(/year 7/i)) years.push(6);
	if (title.match(/prep/i)) years.push(0);
	if (title.match(/junior.+(assembly)/i)) years.push(0, 1, 2, 3);
	if (title.match(/junior.+(choir)/i)) years.push(1, 2);
	if (title.match(/middle.+(choir)/i)) years.push(3, 4);
	if (title.match(/senior.+(choir)/i)) years.push(5, 6);
	if (title.match(/senior.+(assembly)/i)) years.push(4, 5, 6);
	if (title.match(/junior band/i)) years.push(4);
	if (title.match(/senior band/i)) years.push(5, 6);

	return years.filter((d, i, arr) => arr.indexOf(d) === i).sort((a, b) => a - b);
};

const inferCategories = (title: string): Categories[] => {
	const categories: Categories[] = [];
	if (title.match(/choir/i)) categories.push(Categories.Choir);
	if (title.match(/band/i)) categories.push(Categories.Band);
	if (title.match(/string/i)) categories.push(Categories.Strings);
	if (title.match(/assembly/i)) categories.push(Categories.Assembly);
	if (title.match(/p&c/i)) categories.push(Categories['P&C']);
	return categories;
};

const makeCalendarEntry = (obj: APICalendarFormat): CalendarEntry => {
	const yearLevels = inferYears(obj.title);
	const categories = inferCategories(obj.title);
	const start = dayjs(obj.start).tz(TIMEZONE, true);
	const end = dayjs(obj.end).tz(TIMEZONE, true);
	const allDay =
		obj.allDay === '1' ||
		(start.hour() === 0 && start.minute() === 0 && end.hour() === 0 && end.minute() === 0);

	return {
		allDay,
		category: obj.category,
		title: obj.title,
		description: obj.description,
		id: obj.id,
		location: obj.location,
		// Start
		sdate: obj.sdate,
		start,
		stime: obj.stime,
		// End
		edate: obj.edate,
		end,
		etime: obj.etime,
		// Inferred categories
		yearLevels,
		categories
	};
};

export const getCalendarData = async (id: string) => {
	// Removed the get params for simplicity since they don't seem to do anything.
	const url = `https://epublisherapp.com/public/calendar/getevent/${id}`;

	const res = await fetch(url);

	if (res.ok) {
		const rawData = z.array(APICalendarFormat).parse(await res.json());
		return rawData.map(makeCalendarEntry).sort((a, b) => a.start.valueOf() - b.start.valueOf());
	}

	const { message } = await res.json();
	throw new Error(message);
};

export const filterCalendarData = (
	data: CalendarEntry[],
	categories: Categories[],
	yearLevels: YearLevels[]
) =>
	data.filter((d) => {
		return (
			(d.yearLevels.some((d) => yearLevels.includes(d)) || d.yearLevels.length === 0) &&
			(d.categories.some((d) => categories.includes(d)) || d.categories.length === 0)
		);
	});

export const getSubscriptionUrl = () => {
	if (!browser) return null;

	const icalUrl = new URL(
		`webcal://${document.location.hostname}${
			document.location.port === '' ? '' : ':' + document.location.port
		}/ical`
	);

	get(selectedCategories).forEach((category) => {
		icalUrl.searchParams.append('categories', category);
	});
	get(selectedYearLevels).forEach((year) => {
		icalUrl.searchParams.append('years', '' + year);
	});
	return icalUrl.toString();
};
