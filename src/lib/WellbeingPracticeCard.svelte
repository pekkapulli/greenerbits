<script lang="ts">
	import type { CarbonIntensity, DigitalPractice } from '$lib/digitalPractices';

	interface Props {
		practice: DigitalPractice;
		order: number;
		showCarbonIntensity?: boolean;
		ringClass: string;
		cardOutlineDot?: string;
		delayedRevealMs?: number;
	}

	let {
		practice,
		order,
		showCarbonIntensity = false,
		ringClass,
		cardOutlineDot = 'bg-white',
		delayedRevealMs = 0
	}: Props = $props();

	const fireLevels: CarbonIntensity[] = [1, 2, 3];
</script>

<div class={`relative w-full rounded-[1.7rem] border border-white/80 bg-white/95 px-5 pb-5 pt-7 shadow-[0_18px_45px_rgba(45,38,58,0.16)] ${showCarbonIntensity ? ringClass : ''}`}>
	<div class="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
		<span class={`h-3.5 w-3.5 rounded-full shadow-sm ${cardOutlineDot} ${showCarbonIntensity ? ringClass : ''}`}></span>
	</div>

	<div
		class:flipped={showCarbonIntensity}
		class="flip-card grid"
		style={showCarbonIntensity
			? `transition-delay: ${delayedRevealMs}ms;`
			: 'transition-delay: 0ms;'}
	>
		<div class="flip-face col-start-1 row-start-1">
			<div class="mb-3 flex items-center justify-between gap-3">
				<span class="text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-500">
					{order + 1}
				</span>
			</div>
			<p class="text-lg leading-tight text-stone-900 sm:text-xl" style="font-family: Georgia, 'Times New Roman', serif;">
				{practice.label}
			</p>
		</div>

		<div class="flip-face flip-face-back col-start-1 row-start-1">
			<div class="mb-3 flex items-center justify-between gap-3">
				<span class="text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-500">
					{order + 1}
				</span>
				<span class="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
					Relative carbon intensity
				</span>
			</div>
			<p class="text-lg leading-tight text-stone-900 sm:text-xl" style="font-family: Georgia, 'Times New Roman', serif;">
				{practice.label}
			</p>
			<div
				class="mt-4 flex items-center gap-2 text-2xl"
				aria-label={`Relative carbon intensity ${practice.carbonIntensity} of 3`}
			>
				{#each fireLevels as level (level)}
					<span class:opacity-20={level > practice.carbonIntensity}>🔥</span>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	.flip-card {
		transform-style: preserve-3d;
		transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.flip-card.flipped {
		transform: rotateY(180deg);
	}

	.flip-face {
		backface-visibility: hidden;
	}

	.flip-face-back {
		transform: rotateY(180deg);
	}
</style>