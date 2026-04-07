<script lang="ts">
	import { categories, budgetState, type CategoryKey } from '$lib/budgetStore';

	interface Props {
		categoryKey: CategoryKey;
		index: number;
		maxIndex: number;
		isDragging: boolean;
		showActions?: boolean;
		onDragStart: (e: DragEvent, index: number) => void;
		onDragOver: (e: DragEvent, index: number) => void;
		onDragEnd: () => void;
		onDrop: (e: DragEvent, index: number) => void;
		onAdd?: (categoryKey: CategoryKey) => void;
		onUndo?: (categoryKey: CategoryKey) => void;
		onMoveUp?: (categoryKey: CategoryKey) => void;
		onMoveDown?: (categoryKey: CategoryKey) => void;
	}

	let {
		categoryKey,
		index,
		maxIndex,
		isDragging,
		showActions = true,
		onDragStart,
		onDragOver,
		onDragEnd,
		onDrop,
		onAdd,
		onUndo,
		onMoveUp,
		onMoveDown
	}: Props = $props();

	const category = categories[categoryKey];
	const isAdded = $derived($budgetState[categoryKey] !== undefined);

	function handleAddClick(e: MouseEvent) {
		e.stopPropagation();
		onAdd?.(categoryKey);
	}

	function handleUndoClick(e: MouseEvent) {
		e.stopPropagation();
		onUndo?.(categoryKey);
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

	function handleMoveUpClick(e: MouseEvent) {
		e.stopPropagation();
		onMoveUp?.(categoryKey);
	}

	function handleMoveDownClick(e: MouseEvent) {
		e.stopPropagation();
		onMoveDown?.(categoryKey);
	}
</script>

<div class="relative">
	<div
		draggable="true"
		ondragstart={(e) => onDragStart(e, index)}
		ondragover={handleDragOverLocal}
		ondragend={onDragEnd}
		ondrop={(e) => onDrop(e, index)}
		class="w-full p-4 rounded-lg shadow-sm border-2 hover:shadow-md mb-2 {isDragging
			? 'opacity-100 cursor-grab'
			: 'opacity-100 cursor-grab'} {isAdded ? 'opacity-80 bg-gray-100' : ''} border-gray-200"
		style="background-color: {isAdded ? '#fff' : category.color + '15'}"
		role="button"
		tabindex="0"
	>
		<div class="flex items-center justify-between gap-3">
			<div class="flex items-center gap-3">
				<!-- Drag handle -->
				<!-- <DragHandle size={20} /> -->

				<!-- Up/Down arrows -->
				<div class="flex flex-col gap-0.5">
					<button
						onclick={handleMoveUpClick}
						disabled={index === 0}
						class="text-gray-400 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors p-0 leading-none"
						aria-label="Move up"
					>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
							<path d="M6 3L2 7h8L6 3z" />
						</svg>
					</button>
					<button
						onclick={handleMoveDownClick}
						disabled={index === maxIndex}
						class="text-gray-400 hover:text-gray-600 disabled:opacity-20 disabled:cursor-not-allowed transition-colors p-0 leading-none"
						aria-label="Move down"
					>
						<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
							<path d="M6 9L2 5h8L6 9z" />
						</svg>
					</button>
				</div>

				<div
					class="w-6 h-6 rounded text-white flex items-center justify-center font-bold"
					style="background-color: {category.color}"
				>
					{index + 1}
				</div>
				<span class="font-semibold text-gray-800">{category.name}</span>
			</div>

			{#if showActions}
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
			{/if}
		</div>
	</div>
</div>
