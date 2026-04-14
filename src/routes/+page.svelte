<script lang="ts">
	import { resolve } from '$app/paths';
	import {
		getHomeMessages,
		wellbeingSortingLocale,
		wellbeingSortingLocaleOptions
	} from '$lib/homeI18n';

	const languageSelectorId = 'home-language';
	const researchProjectUrl = 'https://blogs.helsinki.fi/greenerbits/';

	$: text = getHomeMessages($wellbeingSortingLocale);
</script>

<main class="mx-auto flex min-h-screen w-full max-w-4xl flex-col px-6 py-10 sm:px-10 sm:py-14">
	<header class="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-6">
		<div>
			<h1 class="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
				{text.pageTitle}
			</h1>
			<p class="mt-2 max-w-2xl text-sm leading-relaxed text-stone-700 sm:text-base">
				{text.pageDescription}
			</p>
		</div>
		<div class="flex items-center gap-3 rounded-md border border-stone-300 bg-white px-3 py-2">
			<label
				for={languageSelectorId}
				class="text-xs font-semibold uppercase tracking-[0.12em] text-stone-600"
			>
				{text.languageLabel}
			</label>
			<select
				id={languageSelectorId}
				bind:value={$wellbeingSortingLocale}
				class="rounded border border-stone-300 bg-white px-2 py-1 text-sm text-stone-800"
			>
				{#each wellbeingSortingLocaleOptions as option (option.value)}
					<option value={option.value}>{option.label}</option>
				{/each}
			</select>
		</div>
	</header>

	<section class="pt-8">
		<article class="rounded-lg border border-stone-200 bg-white p-6 sm:max-w-xl">
			<h2 class="text-xl font-semibold text-stone-900">{text.wellbeingCardsTitle}</h2>
			<p class="mt-3 text-sm leading-relaxed text-stone-700">{text.wellbeingCardsDescription}</p>
			<a
				href={resolve('/wellbeing-cards')}
				class="mt-5 inline-flex items-center rounded-md border border-stone-900 px-4 py-2 text-sm font-medium text-stone-900 transition hover:bg-stone-900 hover:text-white"
			>
				{text.wellbeingCardsLinkLabel}
			</a>
		</article>
	</section>

	<footer class="mt-10 border-t border-stone-200 pt-5 text-sm text-stone-700 sm:mt-14">
		<p class="font-medium text-stone-800">{text.researchTitle}</p>
		<p class="mt-2 max-w-3xl leading-relaxed">{text.researchDescription}</p>
		<a
			href={researchProjectUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="mt-3 inline-flex items-center font-medium text-stone-900 underline decoration-stone-400 underline-offset-4 transition hover:decoration-stone-900"
		>
			{text.researchLinkLabel}
		</a>
	</footer>
</main>
