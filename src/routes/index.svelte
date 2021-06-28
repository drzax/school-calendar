<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { CalendarEntry } from '$lib/types.d';
	import dayjs from 'dayjs';
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
	import CalendarGroup from '$lib/CalendarGroup.svelte';
	import FilterChip from '$lib/FilterChip.svelte';
	import { selectedCategories, selectedYearLevels } from '$lib/storage';
	import { filterCalendarData } from '$lib/utils';
	import { browser } from '$app/env';
	export let calendar: CalendarEntry[];

	let today = dayjs();

	$: filteredCalendar = filterCalendarData(calendar, $selectedCategories, $selectedYearLevels);

	$: thisWeek = filteredCalendar.filter(
		({ start, end }) => start.isAfter(today.startOf('week')) && start.isBefore(today.endOf('week'))
	);
	$: nextWeek = filteredCalendar.filter(
		({ start, end }) =>
			start.isAfter(today.add(1, 'week').startOf('week')) &&
			start.isBefore(today.add(1, 'week').endOf('week'))
	);
	$: later = filteredCalendar.filter(({ start, end }) =>
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
