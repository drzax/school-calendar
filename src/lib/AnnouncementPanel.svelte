<script type="ts">
	import { announcements, type Announcement } from '$lib/announcements';
	import { browser } from '$app/env';
	import { dismissedAnnouncements } from '$lib/storage';
	let unseen: Announcement[] = [];
	$: if (browser)
		unseen = announcements.filter((announcement) => {
			const now = new Date().valueOf();
			if (new Date(announcement.from).valueOf() > now) return false;
			if (new Date(announcement.to).valueOf() < now) return false;
			if (
				typeof announcement.id !== 'undefined' &&
				$dismissedAnnouncements.includes(announcement.id)
			)
				return false;
			return true;
		});

	const dismiss = (id: string) => () => {
		$dismissedAnnouncements = [...$dismissedAnnouncements, id];
	};
</script>

{#each unseen as announcement}
	<section class="prose-blue bg-green-300 rounded-md shadow border-gray-500 p-3 pr-6 mt-6 relative">
		{@html announcement.content}
		{#if typeof announcement.id === 'string'}<button
				on:click={dismiss(announcement.id)}
				class="absolute p-2 top-0 right-0 block leading-none">✕</button
			>{/if}
	</section>
{/each}
