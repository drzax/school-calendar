import { Categories, YearLevels } from '$lib/types.d';
import type { CalendarEntry } from '$lib/types.d';
import { z } from 'zod';
import { TIMEZONE } from './constants';
import { browser } from '$app/environment';
import { selectedCategories, selectedYearLevels } from '$lib/storage';
import { get } from 'svelte/store';
import { makeDayjsObj, today } from './datetime';

const EpublisherAPICalendarFormat = z.object({
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

const WebsiteAPICalendarFormat = z.object({
	ID: z.number(),
	Title: z.string(),
	allDayEvent: z.boolean(),
	// attachments: null,
	category: z.string().nullable(),
	description: z.string(),
	durationMinutes: z.number(),
	durationSeconds: z.number(),
	endDate: z.string(), // ISO datetime
	eventCancelled: z.boolean(),
	// eventContact: null,
	eventDate: z.string(), // ISO datetime
	eventSummary: z.string().nullable(),
	// eventType: 0,
	location: z.string().nullable(),
	// recurrenceException: null,
	// recurrenceID: null,
	// recurrenceRule: null,
	// recurring: false,
	uid: z.string().nullable()
});

type EpublisherAPICalendarFormat = z.infer<typeof EpublisherAPICalendarFormat>;
type WebsiteAPICalendarFormat = z.infer<typeof WebsiteAPICalendarFormat>;

export const inferYears = (title: string): number[] => {
	const years: number[] = [];
	[...title.matchAll(/(years?|yrs?)\s?([1-6])\b(\s?(-|to)\s?([1-6])\b)?/gi)].forEach((d) => {
		const start = +d[2];
		years.push(start);
		const end = +d[5];

		if (end && end > start) {
			for (let i = start + 1; i <= end; i++) {
				years.push(i);
			}
		}
	});

	[...title.matchAll(/(years?|yrs?)([\s,&]+([1-6])\b){2,}/gi)].forEach(([match]) => {
		match.split('').forEach((d) => {
			if (Number.isInteger(+d) && +d < 7 && +d > 0) years.push(+d);
		});
	});

	[...title.matchAll(/p(rep)?\s?-\s?([1-6])\b/gi)].forEach(([match, _, endYear]) => {
		for (var i = 0; i <= +endYear; i++) {
			years.push(i);
		}
	});

	// This is a special cases for year six activities about preparation for year 7
	if (title.match(/year 7\b/i)) years.push(6);

	if (title.match(/prep/i)) years.push(0);
	if (title.match(/junior.+(assembly)/i)) years.push(0, 1, 2, 3);
	if (title.match(/junior.+(choir)/i)) years.push(1, 2);
	if (title.match(/middle.+(choir)/i)) years.push(3, 4);
	if (title.match(/senior.+(choir)/i)) years.push(5, 6);
	if (title.match(/senior.+(assembly)/i)) years.push(4, 5, 6);

	return years.filter((d, i, arr) => arr.indexOf(d) === i).sort((a, b) => a - b);
};

export const inferCategories = (title: string): Categories[] => {
	const categories: Categories[] = [];
	if (title.match(/choir/i)) categories.push(Categories.Choir);
	if (title.match(/choral/i)) categories.push(Categories.Choir);
	if (title.match(/band/i)) categories.push(Categories.Band);
	if (title.match(/string/i)) categories.push(Categories.Strings);
	if (title.match(/assembly/i)) categories.push(Categories.Assembly);
	if (title.match(/p&c/i)) categories.push(Categories['P&C']);
	return categories;
};

const makeCalendarEntryFromEpublisher = (obj: EpublisherAPICalendarFormat): CalendarEntry => {
	const yearLevels = inferYears(obj.title);
	const categories = inferCategories(obj.title);
	const start = makeDayjsObj(obj.start);
	const end = makeDayjsObj(obj.end);
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
		start: start.toISOString(),
		// End
		end: end.toISOString(),
		// Inferred categories
		yearLevels,
		categories
	};
};

const makeCalendarEntryFromWebsite = (obj: WebsiteAPICalendarFormat): CalendarEntry => {
	const yearLevels = inferYears(obj.Title);
	const categories = inferCategories(obj.Title);
	const start = makeDayjsObj(obj.eventDate);
	const end = makeDayjsObj(obj.endDate);
	const allDay =
		obj.allDayEvent ||
		(start.hour() === 0 && start.minute() === 0 && end.hour() === 0 && end.minute() === 0);

	return {
		allDay,
		category: obj.category,
		title: obj.Title,
		description: cleanDescriptionString(obj.description),
		id: String(obj.ID),
		location: obj.location,
		// Start
		start: start.toISOString(),
		// End
		end: end.toISOString(),
		// Inferred categories
		yearLevels,
		categories
	};
};

const fetchWebsiteCalendarData = async (startDate: string): Promise<WebsiteAPICalendarFormat[]> => {
	const endpoint =
		'https://westendss.eq.edu.au/CalendarAndNews/EventsCalendar/_vti_bin/z1/EventsCalendar/service.svc/v1/CalendarEvents/items';

	const settings = {
		timezone: 'Australia/Brisbane',
		showFilters: true,
		displayMode: 0,
		calendarMode: 1,
		layout: 'ListLeftVertical',
		defaultCalendarMode: 0,
		defaultCalendarView: 2,
		headerTitle: 'Events Calendar',
		showHeading: false,
		upcomingItemLimit: 0,
		webServerRelativeUrl: '/CalendarAndNews/EventsCalendar',
		renderBoxShadow: false,
		truncateTitle: true,
		truncateSummary: true,
		hideIfNoData: false,
		isEditMode: false,
		uniqueId: '7686f9f2-83bb-44e4-ba2a-dc57f1d0fa22',
		seeAllTitle: 'See all events',
		showSeeAll: false,
		allEventsLink: '/CalendarAndNews/EventsCalendar/Pages/EventsCalendar.aspx',
		listTitle: 'Calendar',
		startDateField: 'EventDate',
		endDateField: 'EndDate',
		titleField: 'Title',
		summaryField: 'Summary',
		contactField: 'Z1EventContact',
		descriptionField: 'Description',
		locationField: 'Location'
	};

	const params = {
		settings: JSON.stringify(settings),
		startDate,
		overlap: '10',
		skip: '0',
		page: '1'
		// _: '1679613479181'
	};

	const url = new URL(endpoint);
	url.search = String(new URLSearchParams(params));

	const res = await fetch(url);

	if (res.ok) {
		const json = await res.json();
		return z.array(WebsiteAPICalendarFormat).parse(json);
	} else {
		return [];
	}
};

const getWebsiteCalendarData = async (): Promise<CalendarEntry[]> => {
	const month = today.subtract(7, 'days').startOf('month');
	const dates = [
		month.toISOString(),
		month.add(1, 'month').toISOString(),
		month.add(2, 'months').toISOString()
	];
	const data: WebsiteAPICalendarFormat[] = (
		await Promise.all(dates.map((d) => fetchWebsiteCalendarData(d)))
	).flat();

	return data
		.reduce<WebsiteAPICalendarFormat[]>((acc, d, i, arr) => {
			if (i === arr.findIndex((dd) => dd.ID === d.ID && dd.eventDate === d.eventDate)) {
				acc.push(d);
			}
			return acc;
		}, [])
		.map(makeCalendarEntryFromWebsite)
		.sort((a, b) => new Date(a.start).valueOf() - new Date(b.start).valueOf());

	throw new Error('Could not get website calendar data');
};

const getEpublisherCalendarData = async (id: string) => {
	// Removed the get params for simplicity since they don't seem to do anything.
	const url = `https://epublisherapp.com/public/calendar/getevent/${id}`;

	const res = await fetch(url);

	if (res.ok) {
		const rawData = z.array(EpublisherAPICalendarFormat).parse(await res.json());
		return rawData
			.map(makeCalendarEntryFromEpublisher)
			.sort((a, b) => new Date(a.start).valueOf() - new Date(b.start).valueOf());
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

export const getCalendarData = async (id: string | undefined = undefined) => {
	return typeof id === 'undefined' ? getWebsiteCalendarData() : getEpublisherCalendarData(id);
};

export const cleanDescriptionString = (html: string) => {
	return html
		.replace(/<head.*<\/head>/s, '') // Remove head tags and everything between
		.replace(/<\/?(html|body|div)[^>]*>/gs, '') // HTML and body tags
		.replace(/(&nbsp;|&#160;)/g, '') // spaces
		.replace(/(<\w+)\s[^>]+/g, '$1') // all attribututes
		.trim()
		.replace(/<p>\n*\s*(<br\/?>)*\s*\n*<\/p>/g, ''); // all empty p tags
};
