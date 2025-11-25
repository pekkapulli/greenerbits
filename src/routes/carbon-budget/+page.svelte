<script lang="ts">
	import { calculateTreemap, type BudgetItem } from '$lib/treemap';

	let budget = 1.5; // Target: 1.5 tonnes CO₂e per person per year (aligned with Paris Agreement goals)
	let containerWidth = 400;

	$: size = Math.min(containerWidth - 20, 400);

	// Typical Western lifestyle carbon footprint breakdown (tonnes CO₂e per person per year)
	// Average Western footprint is ~10-15 tonnes/year, needs to reduce to ~1.5 tonnes
	// Source assumptions based on EU/US average lifestyle patterns:
	const items = [
		{
			name: 'Transportation',
			value: 3.2, // Assumes car ownership (12,000 km/year at ~200g CO₂/km) + occasional flights
			color: '#34D399'
		},
		{
			name: 'Housing',
			value: 2.8, // Home heating/cooling, electricity (gas/coal-heavy grid), water heating
			color: '#60A5FA'
		},
		{
			name: 'Food',
			value: 2.5, // Western diet with high meat consumption (~50kg meat/year), dairy, processed foods
			color: '#FBBF24'
		},
		{
			name: 'Goods & Services',
			value: 2.0, // Clothing, furniture, electronics, entertainment, services
			color: '#F87171'
		},
		{
			name: 'Digital Consumption',
			value: 0.5, // Streaming, cloud services, device manufacturing share, internet infrastructure
			color: '#A78BFA'
		}
	];

	$: totalConsumption = items.reduce((sum, item) => sum + item.value, 0);
	$: isOverBudget = totalConsumption > budget;

	const border = 8;
	$: treemapBoxes = calculateTreemap(items, budget, size - border, size - border);

	// Calculate the size of the budget overlay box when over budget
	// The area should be proportional: budgetSize² / size² = budget / totalConsumption
	$: budgetOverlaySize = isOverBudget ? size * Math.sqrt(budget / totalConsumption) : 0;
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
	<h1 class="text-3xl font-bold mb-8 text-gray-800">Carbon Budget Puzzle</h1>

	<div class="mb-6 w-full max-w-[400px]" bind:clientWidth={containerWidth}>
		<div class="block mb-2 text-sm font-medium text-gray-700">
			Total Budget: <span class="font-bold text-gray-900">{budget.toFixed(1)} tonnes CO₂e/year</span
			>
		</div>
		<input
			type="range"
			min="0.5"
			max="15"
			step="0.1"
			bind:value={budget}
			class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-green-600"
		/>
	</div>

	<div
		style="width: {size}px; height: {size}px;"
		class="box-border bg-white shadow-lg relative overflow-visible border-4 {isOverBudget
			? 'border-transparent'
			: 'border-gray-800'}"
	>
		{#each treemapBoxes as box}
			<div
				style="
					position: absolute;
					left: {box.x0}px;
					top: {box.y0}px;
					width: {box.width}px;
					height: {box.height}px;
					background-color: {box.color};
				"
				class="flex items-center justify-center text-white text-xs font-semibold p-1"
			>
				<span class="text-center">{box.name}</span>
			</div>
		{/each}

		{#if isOverBudget}
			<!-- Budget overlay box showing the actual sustainable budget size -->
			<div
				style="
					position: absolute;
					left: {(size - budgetOverlaySize) / 2 - border / 2}px;
					top: {(size - budgetOverlaySize) / 2 - border / 2}px;
					width: {budgetOverlaySize}px;
					height: {budgetOverlaySize}px;
				"
				class="border-4 border-gray-800 pointer-events-none"
			></div>
		{/if}
	</div>
</div>
