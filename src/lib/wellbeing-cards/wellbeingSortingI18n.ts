import { writable } from 'svelte/store';

import type { CarbonIntensity } from '$lib/digitalPractices';

export type WellbeingSortingLocale = 'en' | 'fi';

interface WellbeingSortingMessages {
	languageLabel: string;
	pageTitle: string;
	pageDescription: string;
	progressLabel: (placedCount: number, totalCount: number) => string;
	notRelevant: string;
	undo: string;
	reset: string;
	axisNegative: string;
	axisNeutral: string;
	axisPositive: string;
	sortByScore: string;
	showPlacementOrder: string;
	showCarbonIntensities: string;
	hideCarbonIntensities: string;
	carbonIntensityAriaLabel: (intensity: CarbonIntensity) => string;
}

export const wellbeingSortingLocale = writable<WellbeingSortingLocale>('fi');

export const wellbeingSortingLocaleOptions = [
	{ value: 'en', label: 'English' },
	{ value: 'fi', label: 'Suomi' }
] as const;

const messages: Record<WellbeingSortingLocale, WellbeingSortingMessages> = {
	en: {
		languageLabel: 'Language / Kieli',
		pageTitle: 'Digital practices and wellbeing',
		pageDescription: 'Rate how you think different digital practices affect your wellbeing.',
		progressLabel: (placedCount, totalCount) => `${placedCount} of ${totalCount} practices placed`,
		notRelevant: 'Not relevant',
		undo: 'Undo',
		reset: 'Reset',
		axisNegative: 'Negative effect on wellbeing',
		axisNeutral: 'A mix of positive and negative effects',
		axisPositive: 'Positive effect on wellbeing',
		sortByScore: 'Sort by score',
		showPlacementOrder: 'Show placement order',
		showCarbonIntensities: '🔥 Show carbon intensities',
		hideCarbonIntensities: 'Hide carbon intensities',
		carbonIntensityAriaLabel: (intensity) => `Relative carbon intensity ${intensity} of 3`
	},
	fi: {
		languageLabel: 'Language / Kieli',
		pageTitle: 'Digitaaliset käytännöt ja hyvinvointi',
		pageDescription: 'Arvioi, miten eri digitaaliset käytännöt mielestäsi vaikuttavat hyvinvointiisi.',
		progressLabel: (placedCount, totalCount) => `${placedCount}/${totalCount} käytäntöä sijoitettu`,
		notRelevant: 'Ei relevantti',
		undo: 'Peru',
		reset: 'Nollaa',
		axisNegative: 'Kielteinen vaikutus hyvinvointiin',
		axisNeutral: 'Myönteisiä ja kielteisiä vaikutuksia',
		axisPositive: 'Myönteinen vaikutus hyvinvointiin',
		sortByScore: 'Järjestä pisteytyksen mukaan',
		showPlacementOrder: 'Alkuperäinen järjestys',
		showCarbonIntensities: '🔥 Näytä hiili-intensiteetit',
		hideCarbonIntensities: 'Piilota hiili-intensiteetit',
		carbonIntensityAriaLabel: (intensity) => `Suhteellinen hiili-intensiteetti ${intensity} / 3`
	}
};

export function getWellbeingSortingMessages(locale: WellbeingSortingLocale) {
	return messages[locale];
}