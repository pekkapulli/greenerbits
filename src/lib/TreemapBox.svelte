<svelte:options customElement="treemap-box" />

<script lang="ts">
	import chroma from 'chroma-js';
	import type { TreemapBoxType } from './treemap';

	const {
		box,
		handleClick
	}: {
		box: TreemapBoxType;
		handleClick: (box: TreemapBoxType) => void;
	} = $props();

	let hovered = $state(false);
	let bgColor = $state(box.color ? chroma(box.color).hex() : undefined);

	$effect(() => {
		bgColor = box.color
			? hovered
				? chroma(box.color).brighten(0.5).hex()
				: chroma(box.color).hex()
			: undefined;
	});
</script>

<button
	style="
		position: absolute;
		left: {box.x0}px;
		top: {box.y0}px;
		width: {box.width}px;
		height: {box.height}px;
		background-color: {bgColor};
	"
	class="flex items-center justify-center text-black text-xs font-semibold p-1 cursor-pointer transition-colors duration-150"
	onmouseenter={() => (hovered = true)}
	onmouseleave={() => (hovered = false)}
	onclick={() => handleClick(box)}
>
	{box.name}
</button>
