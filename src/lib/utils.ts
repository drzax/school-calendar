import dayjs from 'dayjs';
import { Categories, YearLevels } from '$lib/types.d';
import type { CalendarEntry } from '$lib/types.d';

const inferYears = (title: string): number[] => {
	const years: number[] = [...title.matchAll(/(year|yr)\s([1-6])/gi)].map((d) => +d[2]);
	if (title.match(/year 7/i)) years.push(6);
	if (title.match(/prep/i)) years.push(0);
	if (title.match(/junior.+(assembly)/i)) years.push(0, 1, 2, 3);
	if (title.match(/junior.+(choir)/i)) years.push(1, 2, 3);
	if (title.match(/senior.+(assembly|choir)/i)) years.push(4, 5, 6);
	if (title.match(/junior band/i)) years.push(4);
	if (title.match(/senior band/i)) years.push(5, 6);
	return years;
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

const makeCalendarEntry = (obj: any): CalendarEntry => {
	const yearLevels = inferYears(obj.title);
	const categories = inferCategories(obj.title);

	return {
		allDay: obj.allDay === '1',
		category: obj.category,
		description: obj.description,
		edate: obj.edate,
		end: dayjs(obj.end),
		etime: obj.etime,
		id: obj.id,
		location: obj.location,
		sdate: obj.sdate,
		start: dayjs(obj.start),
		stime: obj.stime,
		title: obj.title,
		yearLevels,
		categories
	};
};

export const getCalendarData = async (id: string) => {
	const now = dayjs();
	const res = await fetch(
		`https://epublisherapp.com/public/calendar/getevent/${id}?category=&start=2015-01-01&false=${
			now.year() + 1
		}-01-01`
	);

	if (res.ok) {
		return ((await res.json()) as any[])
			.map(makeCalendarEntry)
			.sort((a, b) => a.start.valueOf() - b.start.valueOf());
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
