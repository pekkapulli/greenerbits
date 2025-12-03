<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}

<style>
	:global(html),
	:global(body) {
		margin: 0;
		padding: 0;
		height: auto;
		min-height: 100vh;
		font-family: system-ui, sans-serif;
		background-color: #f9fafb; /* Tailwind gray-100 */
		color: #111827; /* Tailwind gray-900 */
		overflow-y: scroll;
	}

	:global(#svelte) {
		min-height: 100vh;
		height: auto;
	}
</style>
