import type { Dayjs } from 'dayjs';
import type ics from 'ics';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';
import toArray from 'dayjs/plugin/toArray.js';
import { TIMEZONE } from './constants';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(toArray);
dayjs.tz.setDefault(TIMEZONE);

export const today = dayjs().tz(TIMEZONE);

/*
 * Parses a date/time string
 */
export const makeDayjsObj = (date: string) => {
	const hasTZ = /\d{4}-\d{2}-\d{2}.*(Z|(\+|\-)\d{2}(\:?\d{2})?)$/.test(date);
	return hasTZ ? dayjs(date) : dayjs.tz(date, TIMEZONE);
};

export const getDateArray = (date: Dayjs, allDay: boolean): ics.DateArray => {
	const bumpMonth = (d: number, i: number) => (i === 1 ? d + 1 : d);
	return allDay
		? // All day events, it seems, don't use timezones in the ICS format
		  // so it gets converted to Brisbane before output
		  (date.tz(TIMEZONE).toArray().slice(0, 3).map(bumpMonth) as [number, number, number])
		: // The input and output of date/time info to the ics generator should be in UTC.
		  (date.utc().toArray().slice(0, 5).map(bumpMonth) as [number, number, number, number, number]);
};
