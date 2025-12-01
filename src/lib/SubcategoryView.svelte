<script lang="ts">
	import { budgetState, type Subcategory, type CategoryKey } from './budgetStore';

	interface Props {
		subcategory: Subcategory;
		categoryId: CategoryKey;
		onBack: () => void;
	}

	const { subcategory, categoryId, onBack }: Props = $props();

	function selectOption(index: number) {
		budgetState.update((state) => {
			return {
				...state,
				[categoryId]: {
					...state[categoryId],
					[subcategory.id]: index
				}
			};
		});
		onBack();
	}

	let selectedIndex = $derived($budgetState[categoryId]?.[subcategory.id] ?? 0);
</script>

<div class="p-4">
	<button
		class="flex items-center text-gray-600 hover:text-gray-800 mb-4 -ml-2 cursor-pointer"
		onclick={onBack}
	>
		<svg
			class="w-5 h-5 mr-1"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"
			></path>
		</svg>
		Back
	</button>

	<h3 class="text-xl font-bold text-gray-800 mb-4">{subcategory.name}</h3>

	<div class="space-y-3">
		{#each subcategory.options as option, index}
			<button
				class="w-full text-left p-4 rounded-lg border-2 transition-all hover:border-green-500 {selectedIndex ===
				index
					? 'border-green-600 bg-green-50'
					: 'border-gray-200 bg-white'}"
				onclick={() => selectOption(index)}
			>
				<div class="flex justify-between items-start mb-2">
					<span class="font-semibold text-gray-800">{option.label}</span>
					<span class="font-mono text-green-600 font-bold">{option.value.toFixed(2)} t CO₂e</span>
				</div>
				{#if option.description}
					<p class="text-sm text-gray-600">{option.description}</p>
				{/if}
			</button>
		{/each}
	</div>
</div>
