<script lang="ts">
	import { calculateTreemap, type TreemapBoxType } from '$lib/treemap';
	import { currentFootprint, totalFootprint } from '$lib/budgetStore';
	import Modal from '$lib/Modal.svelte';
	import ModalContent from '$lib/ModalContent.svelte';
	import TreemapBox from '$lib/TreemapBox.svelte';
	import BudgetSlider from '$lib/BudgetSlider.svelte';

	let budget = 1.5; // Target: 1.5 tonnes CO₂e per person per year (aligned with Paris Agreement goals)
	let containerWidth = 400;

	$: size = Math.min(containerWidth - 20, 400);

	// Use the derived store for items - subscribe with $ syntax
	$: items = $currentFootprint;
	$: totalConsumption = $totalFootprint;

	const border = 4;

	$: treemapBoxes = calculateTreemap(
		items,
		Math.max(budget, totalConsumption),
		size - 2 * border,
		size - 2 * border
	);

	// Calculate the size of the budget overlay box
	// The area should be proportional: budgetSize² / size² = budget / totalConsumption
	// Max out at size when budget >= totalConsumption
	$: budgetOverlaySize = Math.min(size, size * Math.sqrt(budget / totalConsumption));

	let modalOpen = false;
	let selectedBox: TreemapBoxType | null = null;

	function handleBoxClick(box: TreemapBoxType) {
		console.log('Box clicked in page:', box);
		selectedBox = box;
		modalOpen = true;
	}
</script>

<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
	<h1 class="text-3xl font-bold mb-8 text-gray-800">Carbon Budget Puzzle</h1>

	<div class="mb-6 w-full max-w-[400px]" bind:clientWidth={containerWidth}>
		<div class="block mb-2 text-sm font-medium text-gray-700">
			Total Budget: <span class="font-bold text-gray-900">{budget.toFixed(1)} tonnes CO₂e/year</span
			>
		</div>
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

	<div
		style="width: {size}px; height: {size}px;"
		class="bg-white shadow-lg relative overflow-visible border-{border} border-transparent"
	>
		{#each treemapBoxes as box}
			<TreemapBox {box} handleClick={handleBoxClick} />
		{/each}

		<!-- Budget overlay box showing the target budget size -->
		<div
			style="
        position: absolute;
				left: {(size - budgetOverlaySize) / 2 - border}px;
				top: {(size - budgetOverlaySize) / 2 - border}px;
				width: {budgetOverlaySize}px;
				height: {budgetOverlaySize}px;
			"
			class="border-4 border-green-600 pointer-events-none opacity-50"
		></div>

		<Modal
			open={modalOpen}
			onClose={() => (modalOpen = false)}
			color={selectedBox?.color ?? 'white'}
		>
			<ModalContent box={selectedBox} />
		</Modal>
	</div>
</div>
