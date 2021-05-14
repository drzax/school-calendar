<script lang="ts">
	import Header from '$lib/Header.svelte';
	import '../app.pcss';
</script>

<Header />

<main class="container mx-auto max-w-3xl">
	<slot />
</main>

<footer class="container mx-auto text-center text-sm text-gray-500">
	<div class="max-w-lg mx-5">
		<p>
			This was built by <a href="https://elvery.net/">Simon Elvery</a> to scratch an itch (i.e. the regular
			school calendar is difficult to parse quickly).
		</p>

		<p class="mt-2">
			Data is sourced directly from the live <a
				href="https://epublisherapp.com/public/calendars/app/301935/C4801/ZUFqdWMyNzREK3lUYmw5bHBpRzZRQT09"
				>public calendar</a
			>, which you should always treat as the source of truth (i.e. don't blame me if you miss an
			assembly).
		</p>

		<p class="mt-2">
			You can see the
			<a href="https://github.com/drzax/school-calendar">source code</a>.
		</p>
	</div>
</footer>

<style>
	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 40px;
	}

	footer a {
		font-weight: bold;
	}

	@media (min-width: 480px) {
		footer {
			padding: 40px 0;
		}
	}
</style>
