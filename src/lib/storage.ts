import dayjs from 'dayjs';
import { writable } from 'svelte/store';
import { browser } from '$app/environment';
import type { CalendarDigestEntry, YearLevels } from '$lib/types.d';
import { Categories } from '$lib/types.d';

type storateType = 'local' | 'session';

const now = dayjs().toString();

const getBrowserStorage = <T>(id: string, type: storateType): T | undefined => {
	try {
		switch (type) {
			case 'local':
				return JSON.parse(localStorage[id]);
			case 'session':
				return JSON.parse(sessionStorage[id]);
			default:
				throw new Error(`Storage type '${type}' not supported`);
		}
	} catch (e) {}
};

const getStore = <T>(id: string, init: T, type: storateType) => {
	const store = writable<T>(getBrowserStorage<T>(id, type) || init);
	browser &&
		store.subscribe((value) =>
			type === 'local'
				? (localStorage[id] = JSON.stringify(value))
				: (sessionStorage[id] = JSON.stringify(value))
		);
	return store;
};

export const selectedYearLevels = getStore<YearLevels[]>(
	'yearLevels',
	[0, 1, 2, 3, 4, 5, 6],
	'local'
);
export const selectedCategories = getStore<Categories[]>(
	'categories',
	Object.values(Categories),
	'local'
);
export const calendarDigest = getStore<CalendarDigestEntry[]>('digest', [], 'local');
export const lastSessionDate = getStore<string | undefined>(
	'lastSessionDate',
	undefined,
	'session'
);
export const thisSessionDate = getStore<string>('thisSessionDate', now, 'local');
export const firstSessionDate = getStore<string>('firstSessionDate', now, 'local');
export const dismissedAnnouncements = getStore<string[]>('dismissedAnnouncements', [], 'local');
