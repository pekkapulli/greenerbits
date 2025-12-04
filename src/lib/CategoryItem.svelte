<script lang="ts">
	import { categories, budgetState, type CategoryKey } from '$lib/budgetStore';
	import DragHandle from '$lib/DragHandle.svelte';

	interface Props {
		categoryKey: CategoryKey;
		index: number;
		maxIndex: number;
		isDragging: boolean;
		onDragStart: (e: DragEvent, index: number, element: HTMLElement) => void;
		onDragOver: (e: DragEvent, index: number) => void;
		onDragEnd: () => void;
		onDrop: (e: DragEvent, index: number) => void;
		onAdd: (categoryKey: CategoryKey) => void;
		onUndo: (categoryKey: CategoryKey) => void;
	}

	const {
		categoryKey,
		index,
		maxIndex,
		isDragging,
		onDragStart,
		onDragOver,
		onDragEnd,
		onDrop,
		onAdd,
		onUndo
	}: Props = $props();

	let dragElement: HTMLDivElement;

	const category = categories[categoryKey];
	const isAdded = $derived($budgetState[categoryKey] !== undefined);

	function handleAddClick(e: MouseEvent) {
		e.stopPropagation();
		onAdd(categoryKey);
	}

	function handleUndoClick(e: MouseEvent) {
		e.stopPropagation();
		onUndo(categoryKey);
	}

	function handleDragOverLocal(e: DragEvent) {
		if (!(e.target instanceof HTMLElement)) return;

		// Find the draggable container
		const container = (e.target as HTMLElement).closest('[draggable="true"]');
		if (!container) return;

		const rect = container.getBoundingClientRect();
		const midpoint = rect.height / 2;
		const offsetY = e.clientY - rect.top;

		// If in bottom half, target position is after this item; otherwise at this index
		const targetIndex = offsetY > midpoint ? Math.min(index + 1, maxIndex) : index;
		onDragOver(e, targetIndex);
	}
</script>

<div class="relative">
	<div
		bind:this={dragElement}
		draggable="true"
		ondragstart={(e) => onDragStart(e, index, dragElement)}
		ondragover={handleDragOverLocal}
		ondragend={onDragEnd}
		ondrop={(e) => onDrop(e, index)}
		class="w-full p-4 rounded-lg shadow-sm border-2 hover:shadow-md mb-2 {isDragging
			? 'opacity-40'
			: 'opacity-100'} {isAdded ? 'opacity-50 bg-gray-100' : ''} border-gray-200"
		style="background-color: {isAdded ? '#f3f4f6' : category.color + '15'}"
		role="button"
		tabindex="0"
	>
		<div class="flex items-center justify-between gap-3">
			<div class="flex items-center gap-3">
				<!-- Drag handle -->
				<DragHandle size={20} />
				<div
					class="w-6 h-6 rounded text-white flex items-center justify-center font-bold"
					style="background-color: {category.color}"
				>
					{index + 1}
				</div>
				<span class="font-semibold text-gray-800">{category.name}</span>
			</div>

			<!-- Add/Undo button -->
			{#if isAdded}
				<button
					onclick={handleUndoClick}
					class="px-3 py-1 text-sm rounded bg-gray-300 hover:bg-gray-400 text-gray-700 transition-colors font-bold"
				>
					- Remove
				</button>
			{:else}
				<button
					onclick={handleAddClick}
					class="px-3 py-1 text-sm rounded bg-green-500 hover:bg-green-600 text-white transition-colors font-bold"
				>
					+ Add
				</button>
			{/if}
		</div>
	</div>
</div>
