<script lang="ts">
	import { currentFootprint, totalFootprint } from '$lib/budgetStore';
	import BudgetSlider from '$lib/BudgetSlider.svelte';
	import CarbonTreemap from '$lib/CarbonTreemap.svelte';
	import CategoryList from '$lib/CategoryList.svelte';

	let budget = 1.5; // Target: 1.5 tonnes CO₂e per person per year (aligned with Paris Agreement goals)
	let containerWidth = 400;

	$: size = Math.min(containerWidth - 20, 400);

	// Use the derived store for items - subscribe with $ syntax
	$: items = $currentFootprint;
	$: totalConsumption = $totalFootprint;
</script>

<div class="flex flex-col items-center min-h-screen h-auto bg-gray-100 px-4 py-8">
	<h1 class="text-3xl font-bold mb-8 text-gray-800">Your Carbon Budget</h1>

	<div class="mb-6 w-full max-w-[400px]" bind:clientWidth={containerWidth}>
		<div class="w-full max-w-md">
			<h2 class="text-xl font-semibold mb-4 text-gray-800">What do you think consumes the most?</h2>
			<p class="mb-8 text-gray-600">
				Drag and drop the categories to reorder them based on your perception of their carbon
				footprint. Press the add buttons to include them in your personal carbon budget.
			</p>
			<CategoryList />
		</div>

		<h2 class="block mb-2 text-sm font-medium text-gray-700 mt-16">
			Total Budget: <span class="font-bold text-gray-900">{budget.toFixed(1)} tonnes CO₂e/year</span
			>
		</h2>
		<BudgetSlider
			value={budget}
			min={0.5}
			max={15}
			step={0.1}
			marks={[
				{ value: 1.5, label: 'Planetary budget' },
				{ value: 10, label: 'Avg. Western' }
			]}
			onChange={(v) => (budget = v)}
		/>
	</div>

	<div class="mb-8">
		<CarbonTreemap {items} {budget} {totalConsumption} {size} />
		<p class="mt-4 text-gray-600">
			Total consumption: <span class="font-bold">{totalConsumption.toFixed(1)}</span> tonnes CO₂e/year
		</p>
	</div>
</div>
