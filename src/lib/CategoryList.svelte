<script lang="ts">
	import { categories, budgetState, type CategoryKey } from '$lib/budgetStore';
	import Modal from '$lib/Modal.svelte';
	import ModalContent from '$lib/ModalContent.svelte';
	import CategoryItem from '$lib/CategoryItem.svelte';
	import type { TreemapBoxType } from '$lib/treemap';
	import { flip } from 'svelte/animate';

	interface Props {
		onReorder?: (categoryKeys: CategoryKey[]) => void;
		showActions?: boolean;
	}

	const { onReorder, showActions = true }: Props = $props();

	let categoryKeys = $state<CategoryKey[]>(Object.keys(categories) as CategoryKey[]);
	let draggedIndex = $state<number | null>(null);
	let modalOpen = $state(false);
	let selectedBox = $state<TreemapBoxType | null>(null);
	let dragPreview = $state<{ x: number; y: number; visible: boolean }>({
		x: 0,
		y: 0,
		visible: false
	});

	function handleDragStart(e: DragEvent, index: number) {
		draggedIndex = index;
		const categoryKey = categoryKeys[index];

		// Set drag data for cross-component drops
		e.dataTransfer?.setData('categoryKey', categoryKey);
		e.dataTransfer?.setData('source', 'categoryList');

		// Hide default drag image
		if (e.dataTransfer) {
			const emptyImg = new Image();
			emptyImg.src =
				'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
			e.dataTransfer.setDragImage(emptyImg, 0, 0);
		}

		// Show custom drag preview
		dragPreview = { x: e.clientX, y: e.clientY, visible: true };
	}

	function handleDragOver(e: DragEvent, targetIndex: number) {
		e.preventDefault();
		e.dataTransfer!.dropEffect = 'move';

		// Update drag preview position
		dragPreview = { x: e.clientX, y: e.clientY, visible: true };

		// Reorder the list in real-time as we drag
		if (draggedIndex !== null && draggedIndex !== targetIndex) {
			const newOrder = [...categoryKeys];
			const [removed] = newOrder.splice(draggedIndex, 1);
			newOrder.splice(targetIndex, 0, removed);

			categoryKeys = newOrder;
			draggedIndex = targetIndex;
		}
	}

	function handleDragEnd() {
		// Hide drag preview
		dragPreview = { x: 0, y: 0, visible: false };

		// Finalize the order
		if (draggedIndex !== null) {
			onReorder?.(categoryKeys);
		}
		// Delay clearing drag state to prevent visual snap-back
		requestAnimationFrame(() => {
			draggedIndex = null;
		});
	}

	function handleDrop(e: DragEvent) {
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

	function handleMoveUp(categoryKey: CategoryKey) {
		const currentIndex = categoryKeys.indexOf(categoryKey);
		if (currentIndex > 0) {
			const newOrder = [...categoryKeys];
			[newOrder[currentIndex - 1], newOrder[currentIndex]] = [
				newOrder[currentIndex],
				newOrder[currentIndex - 1]
			];
			categoryKeys = newOrder;
			onReorder?.(categoryKeys);
		}
	}

	function handleMoveDown(categoryKey: CategoryKey) {
		const currentIndex = categoryKeys.indexOf(categoryKey);
		if (currentIndex < categoryKeys.length - 1) {
			const newOrder = [...categoryKeys];
			[newOrder[currentIndex], newOrder[currentIndex + 1]] = [
				newOrder[currentIndex + 1],
				newOrder[currentIndex]
			];
			categoryKeys = newOrder;
			onReorder?.(categoryKeys);
		}
	}
</script>

<div class="w-full max-w-md">
	{#each categoryKeys as categoryKey, index (categoryKey)}
		<div animate:flip={{ duration: 300 }}>
			<CategoryItem
				{categoryKey}
				{index}
				maxIndex={categoryKeys.length - 1}
				isDragging={isDraggingHelper(index)}
				{showActions}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
				onDrop={handleDrop}
				onAdd={handleAdd}
				onUndo={handleUndo}
				onMoveUp={handleMoveUp}
				onMoveDown={handleMoveDown}
			/>
		</div>
	{/each}
</div>

<!-- Custom drag preview -->
{#if dragPreview.visible && draggedIndex !== null}
	{@const draggedKey = categoryKeys[draggedIndex]}
	{@const draggedCategory = categories[draggedKey]}
	<div
		class="fixed pointer-events-none z-50"
		style="left: {dragPreview.x}px; top: {dragPreview.y}px; transform: translate(-50%, -50%);"
	>
		<div
			class="w-100 p-4 rounded-lg shadow-lg border-2 border-gray-300"
			style="background-color: {draggedCategory.color}"
		>
			<div class="flex items-center gap-3">
				<div
					class="w-6 h-6 rounded text-white flex items-center justify-center font-bold"
					style="background-color: {draggedCategory.color}"
				>
					{draggedIndex + 1}
				</div>
				<span class="font-semibold text-gray-800">{draggedCategory.name}</span>
			</div>
		</div>
	</div>
{/if}

<Modal open={modalOpen} onClose={() => (modalOpen = false)} color={selectedBox?.color ?? 'white'}>
	<ModalContent box={selectedBox} onClose={() => (modalOpen = false)} />
</Modal>
