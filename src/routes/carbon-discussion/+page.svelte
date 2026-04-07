<script lang="ts">
	import {
		currentFootprint,
		totalFootprint,
		categories,
		budgetState,
		type CategoryKey
	} from '$lib/budgetStore';
	import CategoryList from '$lib/CategoryList.svelte';
	import BudgetSlider from '$lib/BudgetSlider.svelte';
	import CarbonTreemap from '$lib/CarbonTreemap.svelte';
	import DiscussionStepItems from '$lib/DiscussionStepItems.svelte';
	import Modal from '$lib/Modal.svelte';
	import ModalContent from '$lib/ModalContent.svelte';
	import type { TreemapBoxType } from '$lib/treemap';
	import { onMount } from 'svelte';

	type Step = 1 | 2 | 3;

	let step: Step = 1;
	let budget = 1.5;
	let containerWidth = 400;
	let modalOpen = false;
	let selectedBox: TreemapBoxType | null = null;
	let answeredCategories: CategoryKey[] = [];

	$: size = Math.min(containerWidth - 20, 400);
	$: items = $currentFootprint;
	$: totalConsumption = $totalFootprint;

	onMount(() => {
		budgetState.update((state) => {
			const nextState = { ...state };

			for (const categoryKey of Object.keys(categories) as CategoryKey[]) {
				if (!nextState[categoryKey]) {
					const category = categories[categoryKey];
					const initialState: Record<string, number> = {};

					category.subcategories.forEach((subcategory) => {
						initialState[subcategory.id] = Math.floor(subcategory.options.length / 2);
					});

					nextState[categoryKey] = initialState;
				}
			}

			return nextState;
		});
	});

	function nextStep() {
		if (step < 3) {
			step = (step + 1) as Step;
		}
	}

	function previousStep() {
		if (step > 1) {
			step = (step - 1) as Step;
		}
	}

	function openCategoryQuestionnaire(categoryKey: CategoryKey) {
		if (step === 2 && !answeredCategories.includes(categoryKey)) {
			answeredCategories = [...answeredCategories, categoryKey];
		}

		const category = categories[categoryKey];
		selectedBox = {
			id: categoryKey,
			name: category.name,
			color: category.color,
			value: 0,
			x0: 0,
			y0: 0,
			x1: 0,
			y1: 0,
			width: 0,
			height: 0
		};
		modalOpen = true;
	}

	function closeModal() {
		modalOpen = false;
		selectedBox = null;
	}
</script>

<div class="flex flex-col items-center min-h-screen h-auto bg-gray-100 px-4 py-8">
	<h1 class="text-3xl font-bold mb-2 text-gray-800">Carbon Discussion</h1>

	<div class="w-full max-w-[400px] mb-8">
		<DiscussionStepItems {step} />
	</div>

	<div class="w-full max-w-[400px]" bind:clientWidth={containerWidth}>
		{#if step === 1}
			<h2 class="text-xl font-semibold mb-4 text-gray-800">What do you think consumes the most?</h2>
			<p class="mb-8 text-gray-600">
				Drag and drop categories to reorder them based on your perception.
			</p>
			<CategoryList showActions={false} />
		{:else if step === 2}
			<h2 class="text-xl font-semibold mb-4 text-gray-800">Questionnaire</h2>
			<p class="mb-6 text-gray-600">
				Open each selected category and answer the detailed lifestyle questions.
			</p>

			{#if items.length === 0}
				<p class="text-gray-600">
					No categories selected yet. Go back to ordering and add at least one category.
				</p>
			{:else}
				<div class="space-y-3">
					{#each items as item (item.id)}
						{@const isAnswered = answeredCategories.includes(item.id as CategoryKey)}
						<button
							class="w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all {isAnswered
								? 'border-green-500 bg-green-50'
								: 'border-gray-200 bg-white hover:border-green-500'}"
							onclick={() => openCategoryQuestionnaire(item.id as CategoryKey)}
						>
							<p class="font-semibold text-gray-800 text-left">{item.name}</p>
							{#if isAnswered}
								<span class="text-green-700 font-medium">✓ Answered</span>
							{:else}
								<span class="text-green-700 font-medium">Answer</span>
							{/if}
						</button>
					{/each}
				</div>
			{/if}
		{:else}
			<h2 class="block mb-2 text-sm font-medium text-gray-700">
				Total Budget: <span class="font-bold text-gray-900"
					>{budget.toFixed(1)} tonnes CO₂e/year</span
				>
			</h2>
			<BudgetSlider
				value={budget}
				min={0.5}
				max={15}
				step={0.1}
				marks={[
					{ value: 1.5, label: 'Planetary budget' },
					{ value: 7, label: 'Avg. Western' }
				]}
				onChange={(v) => (budget = v)}
			/>

			<div class="mt-8 mb-8">
				<CarbonTreemap {items} {budget} {totalConsumption} {size} />
				<p class="mt-4 text-gray-600">
					Total consumption: <span class="font-bold">{totalConsumption.toFixed(1)}</span> tonnes CO₂e/year
				</p>
			</div>
		{/if}
	</div>

	<div class="w-full max-w-[400px] flex items-center justify-between mt-8">
		<button
			onclick={previousStep}
			disabled={step === 1}
			class="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
		>
			Back
		</button>

		<button
			onclick={nextStep}
			disabled={step === 3}
			class="px-4 py-2 rounded-lg bg-green-600 text-white disabled:opacity-40 disabled:cursor-not-allowed"
		>
			Next
		</button>
	</div>
</div>

<Modal open={modalOpen} onClose={closeModal} color={selectedBox?.color ?? 'white'}>
	<ModalContent box={selectedBox} onClose={closeModal} />
</Modal>
