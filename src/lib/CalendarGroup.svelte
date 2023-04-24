<script lang="ts">
	import type { CalendarEntry } from '$lib/types.d';
	import dayjs from 'dayjs';
	import { PUBLIC_CALENDAR, TIMEZONE } from './constants';
	export let title: string;
	export let subtitle: string | undefined = undefined;
	export let entries: CalendarEntry[];
</script>

<header class="flex mt-10 justify-between">
	<h3 class="ml-3 text-xl font-semibold">{title}</h3>
	{#if subtitle}<h4 class="mr-3 mt-1 text-sm text-gray-500">{subtitle}</h4>{/if}
</header>
<div class="rounded-md my-2 bg-white shadow">
	{#each entries as { id, start, end, title, description, categories, yearLevels, allDay, location, isNew, isUpdated } (`${id} ${start}`)}
		{@const startObj = dayjs(start).tz(TIMEZONE)}
		<div class="p-3 border-b flex flex-col md:flex-row justify-start">
			<div class="md:mx-2 md:my-0 my-2 flex-1">
				<h4 class="font-semibold text-pink-500">
					{#if isNew}<span
							class="text-sm rounded-xl px-2 inline-block text-purple-800 bg-purple-100 font-bold"
							>new</span
						>
					{:else if isUpdated}<span
							class="text-sm rounded-xl px-2 inline-block text-purple-800 bg-purple-100 font-bold"
							>updated</span
						>
					{/if}
					{#if title.toLowerCase().includes('graduation')}
						🎓
					{:else if title.toLowerCase().includes('last day')}
						🎉
					{/if}
					{title}
				</h4>
				<p class="text-gray-500 text-sm">
					<span>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 inline -mt-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
						{dayjs(start).format('dddd, D MMMM')}
						{#if !dayjs(end).isSame(start, 'day')}
							- {allDay && !dayjs(start).isSame(end)
								? dayjs(end).subtract(1, 'minute').format('dddd, D MMMM')
								: dayjs(end).format('dddd, D MMMM')}{/if}
					</span>
					<span class="ml-3"
						><svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 inline -mt-1"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						{#if allDay}All day{:else}
							{dayjs(start).format('HH:mm')} - {dayjs(end).format('HH:mm')}{/if}
					</span>
				</p>
				{#if (description || '').trim().length > 0 || (location || '').trim().length > 0}
					<details class="text-sm">
						<summary class="text-gray-500">Details</summary>
						{#if (description || '').trim().length > 0}
							<div>{description}</div>
						{/if}
						{#if (location || '').trim().length > 0}
							<div><strong>Location:</strong> {location}</div>
						{/if}
					</details>
				{/if}
			</div>
			<div class="md:text-right">
				{#each categories as category (category)}
					<div class="text-sm rounded-xl px-2 inline-block text-green-800 bg-green-100 font-bold">
						{category}
					</div>
				{/each}
				{#each yearLevels as year (year)}
					<div
						class="text-sm rounded-xl px-2 inline-block text-yellow-800 bg-yellow-100 font-bold mr-1 md:ml-1 md:mr-0"
					>
						{year === 0 ? 'Prep' : `Year ${year}`}
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="p-3 text-gray-500 prose">
			<h4>Nothing to see here!</h4>
			{#if title === 'This week'}
				<p>
					Either it's school holidays — 😩 — or something might have gone 💥. So <a
						href={PUBLIC_CALENDAR}>check the real thing</a
					>
					and <a href="mailto:simon@elvery.net">let me know</a>.
				</p>
			{/if}
		</div>
	{/each}
</div>
