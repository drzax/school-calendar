/**
 * Can be made globally available by placing this
 * inside `global.d.ts` and removing `export` keyword
 */
export interface Locals {
	userid: string;
}

import type { Dayjs } from 'dayjs';

export enum Categories {
	'Band' = 'Band',
	'Choir' = 'Choir',
	'P&C' = 'P&C',
	'Strings' = 'Strings',
	'Assembly' = 'Assembly'
}

export enum YearLevels {
	'Prep' = 0,
	'Year 1',
	'Year 2',
	'Year 3',
	'Year 4',
	'Year 5',
	'Year 6'
}

export type CalendarEntry = {
	allDay: boolean;
	category: string | null;
	description: string | null;
	// edate: string;
	end: string;
	// etime: string;
	id: string;
	location: string | null;
	// sdate: string;
	start: string;
	// stime: string;
	title: string;
	yearLevels: YearLevels[];
	categories: Categories[];
	isNew?: boolean;
	isUpdated?: boolean;
};

export type CalendarDigestData = { hash: number; updated: string; created: string };
export type CalendarDigestEntry = [string, CalendarDigestData];
