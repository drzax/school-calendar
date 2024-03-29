<script lang="ts">
	import type { PageData } from './$types';
	import { Categories, YearLevels } from '$lib/types.d';
	import dayjs from 'dayjs';
	import type { CalendarEntry } from '$lib/types.d';
	import CalendarGroup from '$lib/CalendarGroup.svelte';
	import termDates from '../lib/term-dates.json';
	import FilterChip from '$lib/FilterChip.svelte';
	import {
		lastSessionDate,
		thisSessionDate,
		selectedCategories,
		selectedYearLevels,
		calendarDigest,
		firstSessionDate
	} from '$lib/storage';
	import { filterCalendarData } from '$lib/utils';
	import type { CalendarDigestData } from '$lib/types.d';
	import hash from 'hash-it';
	import { browser } from '$app/environment';
	import AnnouncementPanel from '$lib/AnnouncementPanel.svelte';
	export let data: PageData;

	const today = dayjs();

	// If this is a new session, store the last session in session storage and update the current session date in local storage
	$: if (typeof $lastSessionDate === 'undefined') {
		const now = today.toString();
		$lastSessionDate = $thisSessionDate || now;
		$thisSessionDate = now;
	}

	$: if (typeof $firstSessionDate === 'undefined') {
		$firstSessionDate = today.toString();
	}

	$: filteredCalendar = filterCalendarData(
		data.calendar,
		$selectedCategories,
		$selectedYearLevels
	).filter(({ start }) => dayjs(start).isAfter(today.startOf('week')));

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
			const firstSessionDateObj = dayjs($firstSessionDate);
			const earlier = thisSessionDateObj.subtract(4, 'days');
			const createdDateObj = dayjs(digestEntry?.created || $thisSessionDate);
			const updatedDateObj = dayjs(digestEntry?.updated || $thisSessionDate);

			return {
				...entry,
				isNew:
					createdDateObj.isAfter(firstSessionDateObj) &&
					(createdDateObj.isAfter(lastSessionDateObj) || createdDateObj.isAfter(earlier)),
				isUpdated:
					updatedDateObj.isAfter(firstSessionDateObj) &&
					(updatedDateObj.isAfter(lastSessionDateObj) || updatedDateObj.isAfter(earlier))
			};
		});

	var displayableCalendar: CalendarEntry[];
	$: displayableCalendar = filteredCalendarWithMeta || filteredCalendar;
	const term = termDates
		.map((t) => ({ name: t[0], start: dayjs(t[1]), end: dayjs(t[2]) }))
		.filter((t) => today >= t.start.startOf('week') && today <= t.end.endOf('week'))[0];
	const currentWeek = term && today.diff(term.start.startOf('week'), 'week') + 1;
	$: thisWeek = displayableCalendar.filter(({ start, end }) =>
		dayjs(start).isBefore(today.endOf('week'))
	);
	$: nextWeek = displayableCalendar.filter(
		({ start, end }) =>
			dayjs(start).isAfter(today.add(1, 'week').startOf('week')) &&
			dayjs(start).isBefore(today.add(1, 'week').endOf('week'))
	);
	$: later = displayableCalendar.filter(({ start, end }) =>
		dayjs(start).isAfter(today.add(1, 'week').endOf('week'))
	);

	let icalUrl: URL;
	$: if (browser) {
		icalUrl = new URL(
			`webcal://${document.location.hostname}${
				document.location.port === '' ? '' : ':' + document.location.port
			}/ical`
		);
		$selectedCategories.forEach((category) => {
			icalUrl.searchParams.append('categories', category);
		});
		$selectedYearLevels.forEach((year) => {
			icalUrl.searchParams.append('years', '' + year);
		});
	}
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
			<a href={icalUrl.toString()}>Subscribe to this calendar?</a>
		{/if}
	</div>
</details>
<AnnouncementPanel />
<section class="m-1">
	<div id="this-week">
		<CalendarGroup
			title="This week"
			subtitle={currentWeek ? `Week ${currentWeek}, ${term.name}` : ''}
			entries={thisWeek}
		/>
	</div>
	<div id="next-week">
		<CalendarGroup
			title="Next week"
			subtitle={currentWeek ? `Week ${currentWeek + 1}, ${term.name}` : ''}
			entries={nextWeek}
		/>
	</div>
	<div id="beyond">
		<CalendarGroup title="Beyond" entries={later} />
	</div>
</section>

<style style lang="postcss">
</style>
