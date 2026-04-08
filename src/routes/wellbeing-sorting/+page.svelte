<script lang="ts">
	import { tick } from 'svelte';
	import { digitalPractices, type CarbonIntensity, type DigitalPractice } from '$lib/digitalPractices';
	import WellbeingPracticeCard from '$lib/WellbeingPracticeCard.svelte';

	interface PlacedPractice extends DigitalPractice {
		x: number;
		order: number;
	}

	const totalCount = digitalPractices.length;

	const axisLabels = [
		{ id: 'negative', label: 'Negative effect on wellbeing', align: 'text-left' },
		{ id: 'neutral', label: 'Neutral', align: 'text-center' },
		{ id: 'positive', label: 'Positive effect on wellbeing', align: 'text-right' }
	] as const;

	const intensityTone: Record<CarbonIntensity, { dot: string; ring: string }> = {
		1: { dot: 'bg-sky-500', ring: 'ring-1 ring-sky-500/20' },
		2: { dot: 'bg-amber-500', ring: 'ring-1 ring-amber-500/20' },
		3: { dot: 'bg-rose-500', ring: 'ring-1 ring-rose-500/20' }
	};

	const dragAnchorOffsetY = 10;
	const cardOutlineDot = 'bg-white';
	const slotHeightPx = 176;

	let placedPractices: PlacedPractice[] = [];
	let nextIndex = 0;
	let canvas: HTMLElement | null = null;
	let currentCard: HTMLButtonElement | null = null;
	let showCarbonIntensities = false;
	let isDragging = false;
	let dragMode: 'current' | 'placed' | null = null;
	let draggedPracticeId: string | null = null;
	let dragX = 0;
	let dragY = 0;
	let dragWidth = 0;
	let pointerOffsetX = 0;
	let pointerOffsetY = 0;

	$: currentPractice = digitalPractices[nextIndex] ?? null;
	$: placedCount = placedPractices.length;
	$: totalSlots = currentPractice ? placedCount + 1 : placedCount;
	$: slotIndexes = Array.from({ length: totalSlots }, (_, index) => index);
	$: highlightedSlotIndex = !isDragging
		? null
		: dragMode === 'placed' && draggedPracticeId
			? placedPractices.findIndex((practice) => practice.id === draggedPracticeId)
			: nextIndex;
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
		const element = event.currentTarget;

		if (!currentPractice || !(element instanceof HTMLButtonElement)) {
			return;
		}

		currentCard = element;
		const rect = currentCard.getBoundingClientRect();
		dragWidth = rect.width;
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
		const centerX = left - canvasRect.left + dragWidth / 2;
		const insideCanvas =
			event.clientX >= canvasRect.left &&
			event.clientX <= canvasRect.right &&
			event.clientY >= canvasRect.top &&
			event.clientY <= canvasRect.bottom;

		if (insideCanvas) {
			if (dragMode === 'current' && currentPractice) {
				void placeCurrentPractice(centerX, canvasRect.width);
			}

			if (dragMode === 'placed' && draggedPracticeId) {
				repositionPractice(draggedPracticeId, centerX, canvasRect.width);
			}
		}

		isDragging = false;
		dragMode = null;
		draggedPracticeId = null;
	}

	async function placeCurrentPractice(centerX: number, width: number) {
		if (!currentPractice) {
			return;
		}

		const safeHalfWidth = dragWidth > 0 ? dragWidth / 2 : 144;
		const x = clamp(centerX, safeHalfWidth + 16, width - safeHalfWidth - 16) / width;

		placedPractices = [...placedPractices, { ...currentPractice, x, order: nextIndex }];
		nextIndex += 1;

		await tick();

		if (nextIndex < totalCount) {
			scrollToSlot(nextIndex, 'smooth');
		}
	}

	function repositionPractice(practiceId: string, centerX: number, width: number) {
		const safeHalfWidth = dragWidth > 0 ? dragWidth / 2 : 144;
		const x = clamp(centerX, safeHalfWidth + 16, width - safeHalfWidth - 16) / width;

		placedPractices = placedPractices.map((practice) =>
			practice.id === practiceId ? { ...practice, x } : practice
		);
	}

	function scrollToSlot(slotIndex: number, behavior: ScrollBehavior = 'smooth') {
		if (!canvas) {
			return;
		}

		const slot = canvas.querySelector<HTMLElement>(`[data-slot-index="${slotIndex}"]`);

		if (!slot) {
			return;
		}

		const slotRect = slot.getBoundingClientRect();
		const targetTop = Math.max(
			window.scrollY + slotRect.top - (window.innerHeight - slotRect.height) / 2,
			0
		);
		window.scrollTo({ top: targetTop, behavior });
	}

	async function undoLastPlacement() {
		if (placedPractices.length === 0) {
			return;
		}

		placedPractices = placedPractices.slice(0, -1);
		nextIndex = Math.max(0, nextIndex - 1);

		await tick();
		scrollToSlot(nextIndex, 'smooth');
	}

	async function resetCanvas() {
		placedPractices = [];
		nextIndex = 0;
		showCarbonIntensities = false;
		isDragging = false;
		dragMode = null;
		draggedPracticeId = null;

		await tick();

		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<svelte:window onpointermove={handlePointerMove} onpointerup={handlePointerUp} />

<div class="relative min-h-screen overflow-x-hidden bg-[#f4f1ea] text-stone-900">
	<div class="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.8),_transparent_40%),linear-gradient(90deg,rgba(99,60,176,0.22)_0%,rgba(153,118,219,0.12)_24%,rgba(255,255,255,0.62)_50%,rgba(148,211,163,0.16)_76%,rgba(44,145,95,0.24)_100%)]"></div>
	<div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] opacity-35"></div>

	<section class="relative min-h-screen overflow-x-hidden pb-28 sm:pb-32">
		

		<div class="relative z-10 px-4 pt-24 text-center sm:px-8 sm:pt-28">
			<h1 class="text-3xl leading-tight text-stone-900 sm:text-5xl" style="font-family: Georgia, 'Times New Roman', serif;">
				Digital practices and wellbeing
			</h1>
			<p class="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-stone-700 sm:text-base">
				Rate how you think different digital practices affect your wellbeing.
			</p>
		</div>

		<div class="pointer-events-none inset-x-0 mb-4 flex items-start justify-end px-4 py-4 sm:px-6">
			<div class="pointer-events-auto flex max-w-[min(100%,32rem)] flex-wrap items-center justify-end gap-2">
				<div class="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-sm font-medium text-stone-700 backdrop-blur">
					{placedCount}/{totalCount}
				</div>
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
		<div class="mx-4 sm:mx-8">
			<div
				class="relative flex h-full flex-col overflow-hidden rounded-[2.5rem] border border-white/50 bg-white/18 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)]"
			>
				<div class="pointer-events-none absolute top-12 bottom-0 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(180deg,rgba(25,25,25,0.2)_0%,rgba(55,55,55,0.2)_100%)]"></div>
				<div class="pointer-events-none absolute inset-y-0 left-[12.5%] w-px bg-white/25"></div>
				<div class="pointer-events-none absolute inset-y-0 right-[12.5%] w-px bg-white/25"></div>

				<div class="pointer-events-none relative z-10 px-4 pb-2 pt-5 sm:px-6 sm:pt-6">
					<div class="grid grid-cols-3 gap-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-600 sm:text-xs">
						{#each axisLabels as axisLabel (axisLabel.id)}
							<p class={axisLabel.align}>{axisLabel.label}</p>
						{/each}
					</div>
				</div>

				<div class="relative flex-1">
					<div bind:this={canvas} class="relative px-4 pb-24 pt-4 sm:px-6 sm:pb-28 sm:pt-5">
						{#each slotIndexes as slotIndex (slotIndex)}
							{@const practice = placedPractices[slotIndex]}
							<div
								data-slot-index={slotIndex}
								class="relative flex items-center"
								style={`min-height:${slotHeightPx}px;`}
							>
								<div class="pointer-events-none absolute left-0 top-1/2 flex -translate-y-1/2 items-center gap-3">
									<span class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/70 bg-white/72 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-600 backdrop-blur">
										{slotIndex + 1}
									</span>
								</div>

								<div
									class={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ease-out ${slotIndex === highlightedSlotIndex ? 'bg-white/95 shadow-[0_0_22px_rgba(255,255,255,0.45)]' : 'bg-white/35'}`}
									style={slotIndex === highlightedSlotIndex
										? `width:calc(100% - 5rem); height:6rem;`
										: 'width:calc(100% - 5rem); height:1px;'}
								></div>

								{#if practice}
									<article
										onpointerdown={(event) => beginPlacedDrag(event, practice.id)}
										class:opacity-0={isDragging && dragMode === 'placed' && draggedPracticeId === practice.id}
										class="absolute top-1/2 z-20 w-[min(18rem,calc(100vw-2.5rem))] -translate-x-1/2 -translate-y-1/2"
										style={`left:${practice.x * 100}%; cursor: grab; touch-action: none;`}
									>
										<WellbeingPracticeCard
											practice={practice}
											order={practice.order}
											showCarbonIntensity={showCarbonIntensities}
											ringClass={intensityTone[practice.carbonIntensity].ring}
											{cardOutlineDot}
											delayedRevealMs={Math.min(practice.order * 45, 360)}
										/>
									</article>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<div class="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center bg-[linear-gradient(180deg,rgba(244,241,234,0)_0%,rgba(244,241,234,0.88)_32%,rgba(244,241,234,0.98)_100%)] px-4 pb-4 pt-8 sm:px-6 sm:pb-6">
			{#if currentPractice}
				<button
					bind:this={currentCard}
					type="button"
					onpointerdown={beginDrag}
					class:opacity-0={isDragging && dragMode === 'current'}
					class="pointer-events-auto w-[min(18rem,calc(100vw-2.5rem))] text-left"
					style="touch-action: none;"
				>
					<WellbeingPracticeCard
						practice={currentPractice}
						order={nextIndex}
						ringClass={intensityTone[currentPractice.carbonIntensity].ring}
						{cardOutlineDot}
					/>
				</button>
			{:else if canRevealCarbonIntensities}
					<button
						type="button"
						onclick={toggleCarbonIntensities}
						aria-pressed={showCarbonIntensities}
						class="pointer-events-auto rounded-full cursor-pointer border border-white/70 bg-white/70 px-4 py-2 text-sm font-medium text-stone-700 backdrop-blur transition hover:bg-white"
					>
						{showCarbonIntensities
							? 'Hide carbon intensities'
							: '🔥 Show carbon intensities'}
					</button>
			{/if}
		</div>
	</section>

	{#if isDragging && dragMode === 'current' && currentPractice}
		<div
			class="pointer-events-none fixed left-0 top-0 z-50 w-[min(18rem,calc(100vw-2.5rem))]"
			style={`transform: translate(${dragX}px, ${dragY}px);`}
		>
			<WellbeingPracticeCard
				practice={currentPractice}
				order={nextIndex}
				ringClass={intensityTone[currentPractice.carbonIntensity].ring}
				{cardOutlineDot}
			/>
		</div>
	{/if}

	{#if isDragging && dragMode === 'placed' && draggedPracticeId}
		{@const draggedPractice = placedPractices.find((practice) => practice.id === draggedPracticeId)}
		{#if draggedPractice}
			<div
				class="pointer-events-none fixed left-0 top-0 z-50 w-[min(18rem,calc(100vw-2.5rem))]"
				style={`transform: translate(${dragX}px, ${dragY}px);`}
			>
				<WellbeingPracticeCard
					practice={draggedPractice}
					order={draggedPractice.order}
					showCarbonIntensity={showCarbonIntensities}
					ringClass={intensityTone[draggedPractice.carbonIntensity].ring}
					{cardOutlineDot}
					delayedRevealMs={Math.min(draggedPractice.order * 45, 360)}
				/>
			</div>
		{/if}
	{/if}
</div>