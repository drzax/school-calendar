import { writable } from 'svelte/store';
import { browser } from '$app/env';
import type { CalendarDigestEntry, YearLevels } from '$lib/types.d';
import { Categories } from '$lib/types.d';

type storateType = 'local' | 'session';

const getBrowserStorage = (id: string, type: storateType) => {
	try {
		return JSON.parse(type === 'local' ? localStorage[id] : sessionStorage[id]);
	} catch (e) {}
};

const getStore = <T>(id: string, init: T, type: storateType) => {
	const store = writable<T>(getBrowserStorage(id, type) || init);
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
export const lastSessionDate = getStore<string>('lastSessionDate', undefined, 'session');
export const thisSessionDate = getStore<string>('thisSessionDate', undefined, 'local');
