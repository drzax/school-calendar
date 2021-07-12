<script lang="ts">
	import type { CalendarEntry } from '$lib/types.d';
	export let title: string;
	export let entries: CalendarEntry[];
</script>

<h3 class="ml-3 text-xl font-semibold mt-10">{title}</h3>
<div class="rounded-md my-2 bg-white shadow">
	{#each entries as { id, start, end, title, description, categories, yearLevels, allDay, stime, etime, location } (id)}
		<div class="p-3 border-b flex flex-col md:flex-row justify-start">
			<div class="md:mx-2 md:my-0 my-2 flex-1">
				<h4 class="font-semibold text-pink-500">{title}</h4>
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
						{start.format('dddd, D MMMM')}
						{#if !end.isSame(start, 'day')}
							- {allDay && !start.isSame(end)
								? end.subtract(1, 'minute').format('dddd, D MMMM')
								: end.format('dddd, D MMMM')}{/if}
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
							{stime} - {etime}{/if}
					</span>
				</p>
				{#if description.trim().length > 0 || location.trim().length > 0}
					<details class="text-sm">
						<summary class="text-gray-500">Details</summary>
						{#if description.trim().length > 0}
							<div>{description}</div>
						{/if}
						{#if location.trim().length > 0}
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
			<p>
				Either it's school holidays — 😩 — or something might have gone 💥. So <a
					href="https://epublisherapp.com/public/calendars/app/301935/C4801/ZUFqdWMyNzREK3lUYmw5bHBpRzZRQT09"
					>check the real thing</a
				>
				and <a href="mailto:simon@elvery.net">let me know</a>.
			</p>
		</div>
	{/each}
</div>
