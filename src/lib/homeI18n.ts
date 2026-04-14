import {
	wellbeingSortingLocale,
	wellbeingSortingLocaleOptions,
	type WellbeingSortingLocale
} from '$lib/wellbeing-cards/wellbeingSortingI18n';

interface HomeMessages {
	languageLabel: string;
	pageTitle: string;
	pageDescription: string;
	wellbeingCardsTitle: string;
	wellbeingCardsDescription: string;
	wellbeingCardsLinkLabel: string;
	researchTitle: string;
	researchDescription: string;
	researchLinkLabel: string;
}

export { wellbeingSortingLocale, wellbeingSortingLocaleOptions };

const messages: Record<WellbeingSortingLocale, HomeMessages> = {
	en: {
		languageLabel: 'Language / Kieli',
		pageTitle: 'GreenerBits',
		pageDescription: 'Tools and resources for the GreenerBits project.',
		wellbeingCardsTitle: 'Wellbeing cards activity',
		wellbeingCardsDescription:
			'Explore and arrange digital practices based on how they affect wellbeing.',
		wellbeingCardsLinkLabel: 'Open wellbeing cards',
		researchTitle: 'About the research project',
		researchDescription:
			'Read the research project background, goals, and updates on the University of Helsinki blog.',
		researchLinkLabel: 'Visit the project page'
	},
	fi: {
		languageLabel: 'Language / Kieli',
		pageTitle: 'GreenerBits',
		pageDescription: 'GreenerBits-hankkeen työkaluja.',
		wellbeingCardsTitle: 'Hyvinvointikortit-tehtävä',
		wellbeingCardsDescription:
			'Tutki ja järjestä digitaalisia tekeimisiä sen mukaan, miten ne vaikuttavat hyvinvointiisi.',
		wellbeingCardsLinkLabel: 'Avaa hyvinvointikortit',
		researchTitle: 'Tietoa tutkimushankkeesta',
		researchDescription:
			'Lue tutkimushankkeen taustasta, tavoitteista ja päivityksistä Helsingin yliopiston blogista.',
		researchLinkLabel: 'Siirry hankesivulle'
	}
};

export function getHomeMessages(locale: WellbeingSortingLocale) {
	return messages[locale];
}
