<script lang="ts">
	import { digitalPractices, type CarbonIntensity, type DigitalPractice } from '$lib/digitalPractices';

	interface PlacedPractice extends DigitalPractice {
		x: number;
		y: number;
		order: number;
	}

	const totalCount = digitalPractices.length;

	const axisLabels = [
		{ id: 'negative', label: 'Negative effect on wellbeing', align: 'text-left' },
		{ id: 'neutral', label: 'Neutral', align: 'text-center' },
		{ id: 'positive', label: 'Positive effect on wellbeing', align: 'text-right' }
	] as const;

	const intensityTone: Record<CarbonIntensity, { dot: string; ring: string }> = {
		1: { dot: 'bg-sky-500', ring: 'ring-sky-500/20' },
		2: { dot: 'bg-amber-500', ring: 'ring-amber-500/20' },
		3: { dot: 'bg-rose-500', ring: 'ring-rose-500/20' }
	};

	const dragAnchorOffsetY = 10;
	const cardOutlineDot = 'bg-white';
	const fireLevels = [1, 2, 3] as const;

	let placedPractices: PlacedPractice[] = [];
	let nextIndex = 0;
	let canvas: HTMLElement | null = null;
	let scrollViewport: HTMLElement | null = null;
	let currentCard: HTMLButtonElement | null = null;
	let showCarbonIntensities = false;
	let isDragging = false;
	let dragMode: 'current' | 'placed' | null = null;
	let draggedPracticeId: string | null = null;
	let dragX = 0;
	let dragY = 0;
	let dragWidth = 0;
	let dragHeight = 0;
	let pointerOffsetX = 0;
	let pointerOffsetY = 0;

	$: currentPractice = digitalPractices[nextIndex] ?? null;
	$: placedCount = placedPractices.length;
	$: progress = totalCount === 0 ? 0 : Math.round((placedCount / totalCount) * 100);
	$: canRevealCarbonIntensities = placedCount === totalCount && totalCount > 0;
	$: if (!canRevealCarbonIntensities && showCarbonIntensities) {
		showCarbonIntensities = false;
	}

	function clamp(value: number, min: number, max: number) {
		return Math.min(Math.max(value, min), max);
	}

	function toggleCarbonIntensities() {
		if (!canRevealCarbonIntensities) {
			return;
		}

		showCarbonIntensities = !showCarbonIntensities;
	}

	function beginDrag(event: PointerEvent) {
		if (!currentPractice || !currentCard) {
			return;
		}

		const rect = currentCard.getBoundingClientRect();
		dragWidth = rect.width;
		dragHeight = rect.height;
		pointerOffsetX = rect.width / 2;
		pointerOffsetY = dragAnchorOffsetY;
		dragX = rect.left;
		dragY = rect.top;
		isDragging = true;
		dragMode = 'current';
		draggedPracticeId = null;
		event.preventDefault();
	}

	function beginPlacedDrag(event: PointerEvent, practiceId: string) {
		const element = event.currentTarget;

		if (!(element instanceof HTMLElement)) {
			return;
		}

		const rect = element.getBoundingClientRect();
		dragWidth = rect.width;
		dragHeight = rect.height;
		pointerOffsetX = rect.width / 2;
		pointerOffsetY = dragAnchorOffsetY;
		dragX = rect.left;
		dragY = rect.top;
		isDragging = true;
		dragMode = 'placed';
		draggedPracticeId = practiceId;
		event.preventDefault();
	}

	function handlePointerMove(event: PointerEvent) {
		if (!isDragging) {
			return;
		}

		dragX = event.clientX - pointerOffsetX;
		dragY = event.clientY - pointerOffsetY;
	}

	function handlePointerUp(event: PointerEvent) {
		if (!isDragging || !canvas) {
			isDragging = false;
			dragMode = null;
			draggedPracticeId = null;
			return;
		}

		const canvasRect = canvas.getBoundingClientRect();
		const left = event.clientX - pointerOffsetX;
		const top = event.clientY - pointerOffsetY;
		const centerX = left - canvasRect.left + dragWidth / 2;
		const centerY = top - canvasRect.top + dragHeight / 2;
		const insideCanvas =
			centerX >= 0 && centerX <= canvasRect.width && centerY >= 0 && centerY <= canvasRect.height;

		if (insideCanvas) {
			if (dragMode === 'current' && currentPractice) {
				placeCurrentPractice(centerX, centerY, canvasRect.width, canvasRect.height);
			}

			if (dragMode === 'placed' && draggedPracticeId) {
				repositionPractice(draggedPracticeId, centerX, centerY, canvasRect.width, canvasRect.height);
			}
		}

		isDragging = false;
		dragMode = null;
		draggedPracticeId = null;
	}

	function placeCurrentPractice(centerX: number, centerY: number, width: number, height: number) {
		if (!currentPractice) {
			return;
		}

		const safeHalfWidth = dragWidth > 0 ? dragWidth / 2 : 144;
		const safeHalfHeight = dragHeight > 0 ? dragHeight / 2 : 64;
		const x = clamp(centerX, safeHalfWidth + 16, width - safeHalfWidth - 16) / width;
		const y = clamp(centerY, safeHalfHeight + 16, height - safeHalfHeight - 16) / height;

		placedPractices = [...placedPractices, { ...currentPractice, x, y, order: nextIndex }];
		nextIndex += 1;
	}

	function repositionPractice(
		practiceId: string,
		centerX: number,
		centerY: number,
		width: number,
		height: number
	) {
		const safeHalfWidth = dragWidth > 0 ? dragWidth / 2 : 144;
		const safeHalfHeight = dragHeight > 0 ? dragHeight / 2 : 64;
		const x = clamp(centerX, safeHalfWidth + 16, width - safeHalfWidth - 16) / width;
		const y = clamp(centerY, safeHalfHeight + 16, height - safeHalfHeight - 16) / height;

		placedPractices = placedPractices.map((practice) =>
			practice.id === practiceId ? { ...practice, x, y } : practice
		);
	}

	function undoLastPlacement() {
		if (placedPractices.length === 0) {
			return;
		}

		placedPractices = placedPractices.slice(0, -1);
		nextIndex = Math.max(0, nextIndex - 1);
	}

	function resetCanvas() {
		placedPractices = [];
		nextIndex = 0;
		showCarbonIntensities = false;
		isDragging = false;
		dragMode = null;
		draggedPracticeId = null;
	}
</script>

<svelte:window onpointermove={handlePointerMove} onpointerup={handlePointerUp} />

<div class="relative min-h-screen overflow-hidden bg-[#f4f1ea] text-stone-900">
	<div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_transparent_40%),linear-gradient(90deg,rgba(99,60,176,0.22)_0%,rgba(153,118,219,0.12)_24%,rgba(255,255,255,0.62)_50%,rgba(148,211,163,0.16)_76%,rgba(44,145,95,0.24)_100%)]"></div>
	<div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-35"></div>

	<section class="relative min-h-screen overflow-hidden">
		<div class="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-start justify-between px-4 py-4 sm:px-6">
			<div class="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-stone-600 backdrop-blur">
				Digital practices
			</div>

			<div class="pointer-events-auto flex max-w-[min(100%,32rem)] flex-wrap items-center justify-end gap-2">
				<div class="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-medium text-stone-700 backdrop-blur">
					{placedCount}/{totalCount}
				</div>
				{#if canRevealCarbonIntensities}
					<button
						type="button"
						onclick={toggleCarbonIntensities}
						aria-pressed={showCarbonIntensities}
						class="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-medium text-stone-700 backdrop-blur transition hover:bg-white"
					>
						{showCarbonIntensities
							? 'Hide relative carbon intensities'
							: 'Show relative carbon intensities'}
					</button>
				{/if}
				<button
					type="button"
					onclick={undoLastPlacement}
					disabled={placedPractices.length === 0}
					class="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-medium text-stone-700 backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
				>
					Undo
				</button>
				<button
					type="button"
					onclick={resetCanvas}
					disabled={placedPractices.length === 0 && !currentPractice}
					class="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-medium text-stone-700 backdrop-blur transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
				>
					Reset
				</button>
			</div>
		</div>

		<div class="pointer-events-none absolute inset-x-6 top-24 bottom-36 rounded-[2.5rem] border border-white/50 bg-white/18 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] sm:inset-x-8"></div>
		<div class="pointer-events-none absolute left-1/2 top-24 bottom-36 w-px -translate-x-1/2 bg-white/70"></div>
		<div class="pointer-events-none absolute top-24 bottom-36 left-[12.5%] w-px bg-white/25"></div>
		<div class="pointer-events-none absolute top-24 bottom-36 right-[12.5%] w-px bg-white/25"></div>

		<div class="pointer-events-none absolute inset-x-4 top-18 z-10 sm:inset-x-8 sm:top-20">
			<div class="grid grid-cols-3 gap-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-600 sm:text-xs">
				{#each axisLabels as axisLabel (axisLabel.id)}
					<p class={axisLabel.align}>{axisLabel.label}</p>
				{/each}
			</div>
			<div class="mt-10 h-px bg-white/80"></div>
		</div>

		<div
			bind:this={scrollViewport}
			class="absolute inset-x-0 top-0 bottom-28 overflow-y-auto overscroll-y-contain sm:bottom-32"
		>
			<div
				bind:this={canvas}
				class="relative min-h-[145svh] px-4 pt-32 pb-10 sm:min-h-screen sm:px-6 sm:pt-28"
			>
				{#each placedPractices as practice (practice.id)}
					<article
						onpointerdown={(event) => beginPlacedDrag(event, practice.id)}
						class:opacity-0={isDragging && dragMode === 'placed' && draggedPracticeId === practice.id}
						class={`absolute z-20 w-[min(18rem,calc(100vw-2.5rem))] -translate-x-1/2 -translate-y-1/2 rounded-[1.6rem] border border-white/60 bg-white/86 px-4 pb-4 pt-6 shadow-[0_22px_60px_rgba(43,36,53,0.14)] ring-1 ${intensityTone[practice.carbonIntensity].ring} flip-shell backdrop-blur`}
						style={`left:${practice.x * 100}%; top:${practice.y * 100}%; cursor: grab; touch-action: none;`}
					>
						<div class="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
							<span class={`-mt-1 h-3.5 w-3.5 rounded-full shadow-sm ${cardOutlineDot}`}></span>
						</div>
						<div
							class:flipped={showCarbonIntensities}
							class="flip-card grid"
							style={showCarbonIntensities
								? `transition-delay: ${Math.min(practice.order * 45, 360)}ms;`
								: 'transition-delay: 0ms;'}
						>
							<div class="flip-face col-start-1 row-start-1">
								<div class="mb-3 flex items-center justify-between gap-3">
									<div class="flex items-center gap-2">
										<span class={`h-2.5 w-2.5 rounded-full ${intensityTone[practice.carbonIntensity].dot}`}></span>
										<span class="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
											{practice.order + 1}
										</span>
									</div>
								</div>
								<p class="text-base leading-snug text-stone-900" style="font-family: Georgia, 'Times New Roman', serif;">
									{practice.label}
								</p>
							</div>
							<div class="flip-face flip-face-back col-start-1 row-start-1">
								<div class="mb-3 flex items-center justify-between gap-3">
									<span class="text-[11px] font-semibold uppercase tracking-[0.24em] text-stone-500">
										{practice.order + 1}
									</span>
									<span class="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
										Relative carbon intensity
									</span>
								</div>
								<p class="text-base leading-snug text-stone-900" style="font-family: Georgia, 'Times New Roman', serif;">
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
					</article>
				{/each}
			</div>
		</div>

		<div class="absolute inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-4 sm:px-6 sm:pb-6">
			{#if currentPractice}
				<div class="w-[min(24rem,100%)] rounded-[2rem] border border-white/60 bg-white/40 p-2 shadow-[0_-20px_50px_rgba(43,36,53,0.08)] backdrop-blur-xl">
					<button
						bind:this={currentCard}
						type="button"
						onpointerdown={beginDrag}
						class:opacity-0={isDragging}
						class="relative w-full rounded-[1.7rem] border border-white/80 bg-white/95 px-5 pb-5 pt-7 text-left shadow-[0_18px_45px_rgba(45,38,58,0.16)] transition hover:-translate-y-1"
					>
						<div class="pointer-events-none absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
							<span class={`h-3.5 w-3.5 rounded-full shadow-sm ${cardOutlineDot}`}></span>
						</div>
						<div class="mb-3 flex items-center justify-between gap-3">
							<span class="text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-500">
								{nextIndex + 1}
							</span>
							<span class={`h-2.5 w-2.5 rounded-full ${intensityTone[currentPractice.carbonIntensity].dot}`}></span>
						</div>
						<p class="text-xl leading-tight text-stone-900 sm:text-2xl" style="font-family: Georgia, 'Times New Roman', serif;">
							{currentPractice.label}
						</p>
					</button>
				</div>
			{:else}
				<div class="rounded-full border border-white/70 bg-white/75 px-5 py-3 text-sm font-medium text-stone-700 backdrop-blur">
					{progress}% placed
				</div>
			{/if}
		</div>
	</section>

	{#if isDragging && dragMode === 'current' && currentPractice}
		<div
			class="pointer-events-none fixed left-0 top-0 z-50 w-[min(18rem,calc(100vw-2.5rem))]"
			style={`transform: translate(${dragX}px, ${dragY}px);`}
		>
			<div class={`relative rounded-[1.7rem] border border-white/80 bg-white/96 px-5 pb-5 pt-7 shadow-[0_28px_70px_rgba(42,34,58,0.22)] ring-1 ${intensityTone[currentPractice.carbonIntensity].ring}`}>
				<div class="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
					<span class={`h-3.5 w-3.5 rounded-full shadow-sm ${cardOutlineDot}`}></span>
				</div>
				<div class="mb-3 flex items-center justify-between gap-3">
					<span class="text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-500">
						{nextIndex + 1}
					</span>
					<span class={`h-2.5 w-2.5 rounded-full ${intensityTone[currentPractice.carbonIntensity].dot}`}></span>
				</div>
				<p class="text-xl leading-tight text-stone-900 sm:text-2xl" style="font-family: Georgia, 'Times New Roman', serif;">
					{currentPractice.label}
				</p>
			</div>
		</div>
	{/if}

	{#if isDragging && dragMode === 'placed' && draggedPracticeId}
		{@const draggedPractice = placedPractices.find((practice) => practice.id === draggedPracticeId)}
		{#if draggedPractice}
			<div
				class="pointer-events-none fixed left-0 top-0 z-50 w-[min(18rem,calc(100vw-2.5rem))]"
				style={`transform: translate(${dragX}px, ${dragY}px);`}
			>
				<div class={`relative rounded-[1.7rem] border border-white/80 bg-white/96 px-5 pb-5 pt-7 shadow-[0_28px_70px_rgba(42,34,58,0.22)] ring-1 ${intensityTone[draggedPractice.carbonIntensity].ring}`}>
					<div class="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
						<span class={`h-3.5 w-3.5 rounded-full shadow-sm ${cardOutlineDot}`}></span>
					</div>
					{#if showCarbonIntensities}
						<div class="mb-3 flex items-center justify-between gap-3">
							<span class="text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-500">
								{draggedPractice.order + 1}
							</span>
							<span class="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
								Relative carbon intensity
							</span>
						</div>
						<p class="text-base leading-snug text-stone-900" style="font-family: Georgia, 'Times New Roman', serif;">
							{draggedPractice.label}
						</p>
						<div
							class="mt-4 flex items-center gap-2 text-2xl"
							aria-label={`Relative carbon intensity ${draggedPractice.carbonIntensity} of 3`}
						>
							{#each fireLevels as level (level)}
								<span class:opacity-20={level > draggedPractice.carbonIntensity}>🔥</span>
							{/each}
						</div>
					{:else}
						<div class="mb-3 flex items-center justify-between gap-3">
							<span class="text-[11px] font-semibold uppercase tracking-[0.26em] text-stone-500">
								{draggedPractice.order + 1}
							</span>
							<span class={`h-2.5 w-2.5 rounded-full ${intensityTone[draggedPractice.carbonIntensity].dot}`}></span>
						</div>
						<p class="text-base leading-snug text-stone-900" style="font-family: Georgia, 'Times New Roman', serif;">
							{draggedPractice.label}
						</p>
					{/if}
				</div>
			</div>
		{/if}
	{/if}
</div>

<style>
	.flip-shell {
		perspective: 1200px;
	}

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