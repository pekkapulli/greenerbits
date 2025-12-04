<script lang="ts">
	import { categories, budgetState, type CategoryKey } from '$lib/budgetStore';
	import Modal from '$lib/Modal.svelte';
	import ModalContent from '$lib/ModalContent.svelte';
	import CategoryItem from '$lib/CategoryItem.svelte';
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

	function handleDragStart(e: DragEvent, index: number, element: HTMLElement) {
		draggedIndex = index;
		const categoryKey = categoryKeys[index];

		// Set drag data for cross-component drops
		e.dataTransfer?.setData('categoryKey', categoryKey);
		e.dataTransfer?.setData('source', 'categoryList');

		// Use the actual element as drag image
		if (e.dataTransfer) {
			const rect = element.getBoundingClientRect();
			const offsetX = e.clientX - rect.left;
			const offsetY = e.clientY - rect.top;
			e.dataTransfer.setDragImage(element, offsetX, offsetY);
		}
	}

	function handleDragOver(e: DragEvent, targetIndex: number) {
		e.preventDefault();
		e.dataTransfer!.dropEffect = 'move';

		// Reorder the list in real-time as we drag
		if (draggedIndex !== null && draggedIndex !== targetIndex) {
			const newOrder = [...categoryKeys];
			const [removed] = newOrder.splice(draggedIndex, 1);
			newOrder.splice(targetIndex, 0, removed);

			categoryKeys = newOrder;
			draggedIndex = targetIndex;
		}

		dragOverIndex = targetIndex;
	}

	function handleDragEnd() {
		// Finalize the order
		if (draggedIndex !== null) {
			onReorder?.(categoryKeys);
		}
		// Delay clearing drag state to prevent visual snap-back
		requestAnimationFrame(() => {
			draggedIndex = null;
			dragOverIndex = null;
		});
	}

	function handleDrop(e: DragEvent, index: number) {
		e.preventDefault();
		e.stopPropagation();
		handleDragEnd();
	}

	function isDraggingHelper(index: number): boolean {
		return draggedIndex === index;
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
		<CategoryItem
			{categoryKey}
			{index}
			maxIndex={categoryKeys.length - 1}
			isDragging={isDraggingHelper(index)}
			onDragStart={handleDragStart}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
			onDrop={handleDrop}
			onAdd={handleAdd}
			onUndo={handleUndo}
		/>
	{/each}
</div>

<Modal open={modalOpen} onClose={() => (modalOpen = false)} color={selectedBox?.color ?? 'white'}>
	<ModalContent box={selectedBox} onClose={() => (modalOpen = false)} />
</Modal>
