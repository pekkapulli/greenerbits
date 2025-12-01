<script lang="ts">
	import { categories, budgetState, type Subcategory } from './budgetStore';
	import { type TreemapBoxType } from './treemap';
	import SubcategoryView from './SubcategoryView.svelte';

	interface Props {
		box?: TreemapBoxType | null;
	}

	const { box }: Props = $props();

	const categoryData = box ? categories[box.id] : null;
	const categoryState = $derived(box ? $budgetState[box.id] : null);

	const totalFootprint = $derived.by(() => {
		if (!box || !categoryData || !categoryState) return 0;
		return categoryData.subcategories.reduce((sum, subcategory) => {
			const selectedIndex = categoryState[subcategory.id] || 0;
			return sum + subcategory.options[selectedIndex].value;
		}, 0);
	});

	let selectedSubcategory = $state<Subcategory | null>(null);

	function openSelector(subcategory: Subcategory) {
		selectedSubcategory = subcategory;
	}

	function closeSelector() {
		selectedSubcategory = null;
	}
</script>

{#if box && categoryData && categoryState}
	<div class="relative overflow-hidden min-h-[400px]">
		{#if !selectedSubcategory}
			<div class="p-4">
				<h2 class="text-2xl font-bold mb-4">{box.name}</h2>
				<p class="mb-4">
					Total carbon footprint: <span class="font-mono font-bold text-lg"
						>{totalFootprint.toFixed(2)}</span
					> t CO₂e/year
				</p>

				<div class="space-y-4">
					{#each categoryData.subcategories as subcategory}
						{@const selectedIndex = categoryState[subcategory.id] || 0}
						{@const selectedOption = subcategory.options[selectedIndex]}

						<button
							class="w-full text-left border-l-4 border-gray-300 pl-4 py-2 hover:border-green-500 hover:bg-gray-50 transition-all rounded-r cursor-pointer"
							onclick={() => openSelector(subcategory)}
						>
							<h3 class="font-semibold text-gray-700 mb-1">{subcategory.name}</h3>
							<p class="text-sm mb-2">
								<span class="font-mono text-green-600">{selectedOption.value.toFixed(2)}</span> t CO₂e/year
							</p>
							<p class="text-sm text-gray-600">
								<strong>{selectedOption.label}</strong>
							</p>
							{#if selectedOption.description}
								<p class="text-xs text-gray-500 mt-1">{selectedOption.description}</p>
							{/if}
						</button>
					{/each}
				</div>
			</div>
		{:else if selectedSubcategory && box}
			<div class="p-4">
				<SubcategoryView
					subcategory={selectedSubcategory}
					categoryId={box.id}
					onBack={closeSelector}
				/>
			</div>
		{/if}
	</div>
{/if}
