<script lang="ts">
	import { categories } from './budgetStore';
	import { type TreemapBoxType } from './treemap';

	interface Props {
		box?: TreemapBoxType | null;
	}

	const { box }: Props = $props();

	const categoryData = box ? categories[box.id] : null;

	console.log('categoryData', categoryData);
</script>

{#if box}
	<div class="p-4">
		<h2 class="text-lg font-bold mb-2">{box.name}</h2>
		<p>Carbon footprint: <span class="font-mono">{box.value}</span> t CO₂e/year</p>
	</div>
{/if}
