<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import { Categories, YearLevels } from '$lib/types.d';
	import { getCalendarData } from '$lib/utils';

	export const load: Load = async ({ fetch }) => {
		try {
			return {
				props: { calendar: await getCalendarData('153') }
			};
		} catch (error) {
			return { error };
		}
	};
</script>

<script lang="ts">
	import dayjs from 'dayjs';
	import type { CalendarEntry } from '$lib/types.d';
	import CalendarGroup from '$lib/CalendarGroup.svelte';
	import FilterChip from '$lib/FilterChip.svelte';
	import {
		lastSessionDate,
		thisSessionDate,
		selectedCategories,
		selectedYearLevels,
		calendarDigest
	} from '$lib/storage';
	import { filterCalendarData } from '$lib/utils';
	import type { CalendarDigestData } from '$lib/types.d';
	import hash from 'hash-it';
	import { browser } from '$app/env';
	export let calendar: CalendarEntry[];

	let today = dayjs();

	// If this is a new session, store the last session in session storage and update the current session date in local storage
	$: if (typeof $lastSessionDate === 'undefined') {
		const now = today.toString();
		$lastSessionDate = $thisSessionDate || now;
		$thisSessionDate = now;
	}

	$: filteredCalendar = filterCalendarData(
		calendar,
		$selectedCategories,
		$selectedYearLevels
	).filter(({ start }) => start.isAfter(today.startOf('week')));

	const calendarDigestMap = new Map<string, CalendarDigestData>($calendarDigest);

	$: if (browser) {
		$calendarDigest = filteredCalendar.map((entry) => {
			const lastDigest = calendarDigestMap.get(entry.id);
			const thisHash = hash(entry);
			return [
				entry.id,
				{
					updated: lastDigest?.hash === thisHash ? lastDigest.updated : $thisSessionDate,
					created: lastDigest?.created || $thisSessionDate,
					hash: thisHash
				}
			];
		});
	}

	let filteredCalendarWithMeta: CalendarEntry[];

	$: if (browser)
		filteredCalendarWithMeta = filteredCalendar.map((entry) => {
			const digestEntry = $calendarDigest.find(([id]) => id === entry.id)?.[1];

			const lastSessionDateObj = dayjs($lastSessionDate);
			const thisSessionDateObj = dayjs($thisSessionDate);
			const createdDateObj = dayjs(digestEntry.created);
			const updatedDateObj = dayjs(digestEntry.updated);

			return {
				...entry,
				isNew:
					!lastSessionDateObj.isSame(thisSessionDateObj) &&
					(createdDateObj.isAfter(lastSessionDateObj) ||
						createdDateObj.isAfter(thisSessionDateObj.subtract(1, 'days'))),
				isUpdated:
					!lastSessionDateObj.isSame(thisSessionDateObj) &&
					(updatedDateObj.isAfter(lastSessionDateObj) ||
						updatedDateObj.isAfter(thisSessionDateObj.subtract(1, 'days')))
			};
		});

	var displayableCalendar: CalendarEntry[];
	$: displayableCalendar = filteredCalendarWithMeta || filteredCalendar;

	$: thisWeek = displayableCalendar.filter(({ start, end }) => start.isBefore(today.endOf('week')));
	$: nextWeek = displayableCalendar.filter(
		({ start, end }) =>
			start.isAfter(today.add(1, 'week').startOf('week')) &&
			start.isBefore(today.add(1, 'week').endOf('week'))
	);
	$: later = displayableCalendar.filter(({ start, end }) =>
		start.isAfter(today.add(1, 'week').endOf('week'))
	);

	let icalUrl: string;
	$: if (browser)
		icalUrl = `webcal://${document.location.hostname}/ical?years=${$selectedYearLevels.join(
			'|'
		)}&categories=${$selectedCategories.join('|')}`;
</script>

<svelte:head>
	<title>School Calendar</title>
</svelte:head>

<details class="text-center">
	<summary class="mt-2 text-sm text-center">Filters</summary>
	<div class="rounded-md m-2 py-2 bg-white shadow">
		<div class="p-2">
			<h3 class="text-lg font-bold">Year</h3>
			{#each Object.keys(YearLevels).filter((d) => typeof YearLevels[d] !== 'string') as level, idx (idx)}
				<FilterChip bind:group={$selectedYearLevels} value={idx} label={level} colour="yellow" />
			{/each}
		</div>
		<div class="p-2">
			<h3 class="text-lg font-bold">Category</h3>
			{#each Object.keys(Categories) as key (key)}
				<FilterChip bind:group={$selectedCategories} value={key} label={key} colour="green" />
			{/each}
		</div>
		{#if icalUrl}
			<a href={icalUrl}>Subscribe to this calendar?</a>
		{/if}
	</div>
</details>

<section class="m-1 p-1">
	<div id="this-week">
		<CalendarGroup title="This week" entries={thisWeek} />
	</div>
	<div id="next-week">
		<CalendarGroup title="Next week" entries={nextWeek} />
	</div>
	<div id="beyond">
		<CalendarGroup title="Beyond" entries={later} />
	</div>
</section>

<style style lang="postcss">
</style>
