<script lang="ts">
	import { calculateTreemap, type TreemapBoxType } from '$lib/treemap';
	import Modal from '$lib/Modal.svelte';
	import ModalContent from '$lib/ModalContent.svelte';
	import TreemapBox from '$lib/TreemapBox.svelte';

	interface Props {
		items: Array<{ id: string; name: string; color: string; value: number }>;
		budget: number;
		totalConsumption: number;
		size: number;
	}

	const { items, budget, totalConsumption, size }: Props = $props();

	const border = 16;
	const innerSize = size - 2 * border;

	let { treemapBoxes, boxesSize } = $derived(
		calculateTreemap(items, Math.max(budget, totalConsumption), innerSize)
	);

	// Calculate the size of the budget overlay box
	// The area should be proportional: budgetSize² / size² = budget / totalConsumption
	// Max out at size when budget >= totalConsumption
	let budgetOverlaySize = $derived(
		Math.min(innerSize, innerSize * Math.sqrt(budget / totalConsumption))
	);

	let modalOpen = $state(false);
	let selectedBox = $state<TreemapBoxType | null>(null);

	function handleBoxClick(box: TreemapBoxType) {
		console.log('Box clicked in treemap:', box);
		selectedBox = box;
		modalOpen = true;
	}
</script>

<div
	style="width: {size}px; height: {size}px;"
	class="bg-white shadow-lg overflow-visible border-{border} border-transparent relative flex items-center justify-center"
>
	<div style="width: {boxesSize}px; height: {boxesSize}px;" class="relative">
		{#each treemapBoxes as box}
			<TreemapBox {box} handleClick={handleBoxClick} />
		{/each}
	</div>

	<!-- Budget overlay box showing the target budget size -->
	<div
		style="
			position: absolute;
			left: {(innerSize - budgetOverlaySize) / 2 + border}px;
			top: {(innerSize - budgetOverlaySize) / 2 + border}px;
			width: {budgetOverlaySize}px;
			height: {budgetOverlaySize}px;
		"
		class="border-4 border-green-600 pointer-events-none opacity-50"
	></div>

	<Modal open={modalOpen} onClose={() => (modalOpen = false)} color={selectedBox?.color ?? 'white'}>
		<ModalContent box={selectedBox} onClose={() => (modalOpen = false)} />
	</Modal>
</div>
