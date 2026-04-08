<script lang="ts">
	import type { CarbonIntensity, DigitalPractice } from '$lib/digitalPractices';
	import {
		getWellbeingSortingMessages,
		type WellbeingSortingLocale
	} from '$lib/wellbeingSortingI18n';

	interface Props {
		practice: DigitalPractice;
		locale?: WellbeingSortingLocale;
		showCarbonIntensity?: boolean;
		intensity: CarbonIntensity;
		delayedRevealMs?: number;
	}

	let {
		practice,
		locale = 'en',
		showCarbonIntensity = false,
		intensity = 1,
		delayedRevealMs = 0
	}: Props = $props();

	const fireLevels: CarbonIntensity[] = [3, 2, 1];

	const intensityTone: Record<CarbonIntensity, { dot: string; ring: string }> = {
		1: { dot: 'bg-sky-500', ring: 'ring-1 ring-sky-500/20' },
		2: { dot: 'bg-amber-500', ring: 'ring-1 ring-amber-500/20' },
		3: { dot: 'bg-rose-500', ring: 'ring-1 ring-rose-500/20' }
	};

	const text = $derived(getWellbeingSortingMessages(locale));
	const primaryLabel = $derived(practice.label[locale]);
	const ringClass = $derived(intensityTone[intensity].ring);
	const dotClass = $derived(showCarbonIntensity ? intensityTone[intensity].dot : 'bg-white');
</script>

<div class={`relative w-full rounded-[1.7rem] border border-white/80 bg-white/95 pb-4 pl-4 pr-3 pt-6 shadow-[0_18px_45px_rgba(45,38,58,0.16)] ${showCarbonIntensity ? ringClass : ''}`}>
	<div class="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
		<span class={`h-3.5 w-3.5 rounded-full shadow-sm ${ringClass} ${dotClass}`}></span>
	</div>

	<div class="grid min-h-[4.75rem] grid-cols-[minmax(0,1fr)_2rem] items-stretch gap-3">
		<div class="flex items-center">
			<p class="text-md leading-tight text-stone-900 sm:text-lg" style="font-family: Georgia, 'Times New Roman', serif;">
				<span>{primaryLabel}</span>
			</p>
		</div>

		<div
			class="flex w-8 flex-col items-center justify-end gap-0.5"
			aria-hidden={!showCarbonIntensity}
			aria-label={text.carbonIntensityAriaLabel(practice.carbonIntensity)}
			style={showCarbonIntensity
				? `transition-delay: ${delayedRevealMs}ms;`
				: 'transition-delay: 0ms;'}
		>
			{#each fireLevels as level (level)}
				<span
					class={`text-[1.35rem] leading-none transition-opacity duration-300 ease-out ${showCarbonIntensity ? (level <= practice.carbonIntensity ? 'opacity-100' : 'opacity-20') : 'opacity-0'}`}
				>
					🔥
				</span>
			{/each}
		</div>
	</div>
</div>