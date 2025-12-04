<script lang="ts">
	import { categories, budgetState, type CategoryKey } from '$lib/budgetStore';
	import Modal from '$lib/Modal.svelte';
	import ModalContent from '$lib/ModalContent.svelte';
	import type { TreemapBoxType } from '$lib/treemap';

	interface Props {
		onReorder?: (categoryKeys: CategoryKey[]) => void;
	}

	const { onReorder }: Props = $props();

	let categoryKeys = $state<CategoryKey[]>(Object.keys(categories) as CategoryKey[]);
	let draggedIndex = $state<number | null>(null);
	let dragOverIndex = $state<number | null>(null);
	let modalOpen = $state(false);
	let selectedBox = $state<TreemapBoxType | null>(null);

	function handleDragStart(index: number) {
		draggedIndex = index;
	}

	function handleDragOver(e: DragEvent, index: number) {
		e.preventDefault();
		if (draggedIndex !== null && draggedIndex !== index && dragOverIndex !== index) {
			dragOverIndex = index;
		}
	}

	function handleDragEnd() {
		if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
			const newOrder = [...categoryKeys];
			const [removed] = newOrder.splice(draggedIndex, 1);
			newOrder.splice(dragOverIndex, 0, removed);
			categoryKeys = newOrder;
			onReorder?.(newOrder);
		}
		draggedIndex = null;
		dragOverIndex = null;
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		handleDragEnd();
	}

	function shouldShowPlaceholder(index: number): boolean {
		return dragOverIndex === index && draggedIndex !== null && draggedIndex !== index;
	}

	function isDragging(index: number): boolean {
		return draggedIndex === index;
	}

	function isAdded(categoryKey: CategoryKey): boolean {
		return $budgetState[categoryKey] !== undefined;
	}

	function handleAdd(categoryKey: CategoryKey) {
		const category = categories[categoryKey];
		// Initialize all subcategories with middle option
		const initialState: Record<string, number> = {};
		category.subcategories.forEach((subcategory) => {
			const middleIndex = Math.floor(subcategory.options.length / 2);
			initialState[subcategory.id] = middleIndex;
		});

		budgetState.update((state) => ({
			...state,
			[categoryKey]: initialState
		}));

		// Open modal for this category
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

	function handleUndo(categoryKey: CategoryKey) {
		budgetState.update((state) => {
			const newState = { ...state };
			delete newState[categoryKey];
			return newState;
		});
	}
</script>

<div class="w-full max-w-md">
	{#each categoryKeys as categoryKey, index (categoryKey)}
		{@const category = categories[categoryKey]}

		<div class="relative">
			<!-- Placeholder space when dragging over -->
			{#if shouldShowPlaceholder(index)}
				<div
					class="h-[72px] mb-2 rounded-lg border-2 border-dashed border-green-500 bg-green-50 transition-all duration-200"
					ondragover={(e) => handleDragOver(e, index)}
					ondrop={handleDrop}
					role="region"
					aria-label="Drop target"
				></div>
			{/if}

			<div
				draggable="true"
				ondragstart={() => handleDragStart(index)}
				ondragover={(e) => handleDragOver(e, index)}
				ondragend={handleDragEnd}
				ondrop={handleDrop}
				class="w-full p-4 rounded-lg shadow-sm border-2 transition-all duration-200 hover:shadow-md mb-2 {isDragging(
					index
				)
					? 'opacity-30 scale-95'
					: 'opacity-100 scale-100'} {isAdded(categoryKey)
					? 'opacity-50 bg-gray-100'
					: ''} border-gray-200"
				style="background-color: {isAdded(categoryKey) ? '#f3f4f6' : category.color + '15'}"
				role="button"
				tabindex="0"
			>
				<div class="flex items-center justify-between gap-3">
					<div class="flex items-center gap-3">
						<!-- Drag handle -->
						<div class="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
							<svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<circle cx="9" cy="5" r="1" />
								<circle cx="9" cy="12" r="1" />
								<circle cx="9" cy="19" r="1" />
								<circle cx="15" cy="5" r="1" />
								<circle cx="15" cy="12" r="1" />
								<circle cx="15" cy="19" r="1" />
							</svg>
						</div>
						<div
							class="w-6 h-6 rounded text-white flex items-center justify-center font-mono font-bold"
							style="background-color: {category.color}"
						>
							{index + 1}
						</div>
						<span class="font-semibold text-gray-800">{category.name}</span>
					</div>

					<!-- Add/Undo button -->
					{#if isAdded(categoryKey)}
						<button
							onclick={(e) => {
								e.stopPropagation();
								handleUndo(categoryKey);
							}}
							class="px-3 py-1 text-sm rounded bg-gray-300 hover:bg-gray-400 text-gray-700 transition-colors font-bold"
						>
							- Remove
						</button>
					{:else}
						<button
							onclick={(e) => {
								e.stopPropagation();
								handleAdd(categoryKey);
							}}
							class="px-3 py-1 text-sm rounded bg-green-500 hover:bg-green-600 text-white transition-colors font-bold"
						>
							+ Add
						</button>
					{/if}
				</div>
			</div>
		</div>
	{/each}
</div>

<Modal open={modalOpen} onClose={() => (modalOpen = false)} color={selectedBox?.color ?? 'white'}>
	<ModalContent box={selectedBox} onClose={() => (modalOpen = false)} />
</Modal>
