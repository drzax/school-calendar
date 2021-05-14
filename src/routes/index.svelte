<script context="module" lang="ts">
	export const prerender = true;

	import type { Load } from '@sveltejs/kit';
	import type { CalendarEntry } from '$lib/types.d';
	import dayjs from 'dayjs';
	import { Categories, YearLevels } from '$lib/types.d';

	const inferYears = (title: string): number[] => {
		const years: number[] = [...title.matchAll(/(year|yr)\s([1-6])/gi)].map((d) => +d[2]);
		if (title.match(/year 7/i)) years.push(6);
		if (title.match(/prep/i)) years.push(0);
		if (title.match(/junior/i)) years.push(0, 1, 2, 3);
		if (title.match(/senior/i)) years.push(4, 5, 6);
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

	export const load: Load = async ({ fetch }) => {
		const now = dayjs();
		const res = await fetch(
			`https://epublisherapp.com/public/calendar/getevent/153?category=&start=2015-01-01&false=${
				now.year() + 1
			}-01-01`
		);

		if (res.ok) {
			const calendar = ((await res.json()) as any[])
				.map(makeCalendarEntry)
				.sort((a, b) => a.start.valueOf() - b.start.valueOf());

			return {
				props: { calendar }
			};
		}

		const { message } = await res.json();

		return {
			error: new Error(message)
		};
	};
</script>

<script lang="ts">
	import CalendarGroup from '$lib/CalendarGroup.svelte';
	import FilterChip from '$lib/FilterChip.svelte';
	import { selectedCategories, selectedYearLevels } from '$lib/storage';
	export let calendar: CalendarEntry[];

	let today = dayjs();

	$: filteredCalendar = calendar
		.filter((d) => {
			return d.yearLevels.some((d) => $selectedYearLevels.includes(d)) || d.yearLevels.length === 0;
		})
		.filter((d) => {
			return d.categories.some((d) => $selectedCategories.includes(d)) || d.categories.length === 0;
		});

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
</script>

<svelte:head>
	<title>Home</title>
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
