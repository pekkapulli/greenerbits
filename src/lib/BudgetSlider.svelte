<script lang="ts">
	interface Mark {
		value: number;
		label: string;
	}

	interface Props {
		value: number;
		min?: number;
		max?: number;
		step?: number;
		marks?: Mark[];
		onChange?: (v: number) => void;
	}

	const { value, min = 0.5, max = 15, step = 0.1, marks = [], onChange }: Props = $props();

	let internal = $state(value);
	let containerWidth = $state(0);

	$effect(() => {
		internal = value;
	});

	function handleInput(e: Event) {
		const target = e.target as HTMLInputElement;
		internal = parseFloat(target.value);
		onChange?.(internal);
	}

	// Thumb width in pixels (matches the default range input thumb)
	const thumbWidth = 16;

	function positionWithThumbOffset(val: number) {
		const clamped = Math.min(Math.max(val, min), max);
		const ratio = (clamped - min) / (max - min);
		// At ratio=0, thumb center is at thumbWidth/2
		// At ratio=1, thumb center is at containerWidth - thumbWidth/2
		// So: position = thumbWidth/2 + ratio * (containerWidth - thumbWidth)
		const thumbHalf = thumbWidth / 2;
		const pixelPos = thumbHalf + ratio * (containerWidth - thumbWidth);

		console.log('percentWithThumbOffset:', { val, clamped, ratio, pixelPos, containerWidth });
		return pixelPos;
	}
</script>

<div class="w-full" bind:clientWidth={containerWidth}>
	<div class="relative h-7">
		<input
			type="range"
			{min}
			{max}
			{step}
			value={internal}
			oninput={handleInput}
			class="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-green-600"
		/>
		<!-- Marks on track -->
		{#if marks?.length}
			{#each marks as mark}
				<button
					class="mark absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-green-900 pointer-events-none"
					style={`left:${positionWithThumbOffset(mark.value)}px`}
					aria-hidden="true"
					onclick={(e) => {
						e.preventDefault();
						internal = mark.value;
						onChange?.(internal);
					}}
				></button>
			{/each}
		{/if}
	</div>

	<!-- Mark labels below slider -->
	{#if marks.length}
		<div class="relative">
			{#each marks as mark}
				<button
					type="button"
					tabindex={1}
					class="mark-label absolute text-xs text-gray-600 max-[120px] px-1 border-l cursor-pointer"
					style={`left:${positionWithThumbOffset(mark.value) - 0.5}px`}
					onclick={(e) => {
						e.preventDefault();
						internal = mark.value;
						onChange?.(internal);
					}}
				>
					{mark.label}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.mark:hover {
		background-color: rgba(34, 197, 94);
	}
	.mark-label:hover {
		background-color: rgba(34, 197, 94, 0.1);
	}
</style>
