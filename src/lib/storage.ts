import { writable } from 'svelte/store';
import { browser } from '$app/env';
import type { YearLevels } from '$lib/types.d';
import { Categories } from '$lib/types.d';

const getLocalStorage = (id: string) => {
	try {
		return JSON.parse(localStorage[`tweener:${id}`]);
	} catch (e) {}
};

const getStore = <T>(id: string, init: T) => {
	const store = writable<T>(getLocalStorage(id) || init);
	browser && store.subscribe((value) => (localStorage[`tweener:${id}`] = JSON.stringify(value)));
	return store;
};

export const selectedYearLevels = getStore<YearLevels[]>('yearLevels', [0, 1, 2, 3, 4, 5, 6]);
export const selectedCategories = getStore<Categories[]>('categories', Object.values(Categories));
