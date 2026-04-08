export type CarbonIntensity = 1 | 2 | 3;

export interface LocalizedLabel {
	en: string;
	fi: string;
}

export interface DigitalPractice {
	id: string;
	label: LocalizedLabel;
	carbonIntensity: CarbonIntensity;
}

export const digitalPractices: DigitalPractice[] = [
	{
		id: 'multiple-devices',
		label: {
			en: 'Forced to use multiple devices (e.g. phones)',
			fi: 'Pakko käyttää useita laitteita (esim. puhelimia)'
		},
		carbonIntensity: 2
	},
	{
		id: 'collecting-watchlists',
		label: {
			en: 'Collecting a list of things to read or watch',
			fi: 'Kokoan listaa luettavista tai katsottavista asioista'
		},
		carbonIntensity: 1
	},
	{
		id: 'videoconferencing',
		label: {
			en: 'Videoconferencing',
			fi: 'Videokokoukset'
		},
		carbonIntensity: 3
	},
	{
		id: 'video-ads-social',
		label: {
			en: 'Forced to view video ads on social media',
			fi: 'Pakotetaan katsomaan videomainoksia sosiaalisessa mediassa'
		},
		carbonIntensity: 2
	},
	{
		id: 'scrolling-social-media',
		label: {
			en: 'Scrolling social media',
			fi: 'Sosiaalisen median selailu'
		},
		carbonIntensity: 2
	},
	{
		id: 'instant-messaging-groups',
		label: {
			en: 'Instant messaging groups',
			fi: 'Pikaviestiryhmät'
		},
		carbonIntensity: 1
	},
	{
		id: 'too-many-photos',
		label: {
			en: 'Storing too many photos',
			fi: 'Liian monen valokuvan tallentaminen'
		},
		carbonIntensity: 2
	},
	{
		id: 'audio-books',
		label: {
			en: 'Listening to audio books',
			fi: 'Äänikirjojen kuuntelu'
		},
		carbonIntensity: 1
	},
	{
		id: 'search-engine',
		label: {
			en: 'Searching for information (with a search engine)',
			fi: 'Tiedon etsiminen hakukoneella'
		},
		carbonIntensity: 1
	},
	{
		id: 'algorithmic-recommendations',
		label: {
			en: 'Viewing content recommended by algorithm',
			fi: 'Algoritmin suositteleman sisällön katselu'
		},
		carbonIntensity: 2
	},
	{
		id: 'work-reading-after-hours',
		label: {
			en: 'Reading work-related things outside work hours',
			fi: 'Työhön liittyvien asioiden lukeminen työajan ulkopuolella'
		},
		carbonIntensity: 1
	},
	{
		id: 'reading-emails',
		label: {
			en: 'Reading emails',
			fi: 'Sähköpostien lukeminen'
		},
		carbonIntensity: 1
	},
	{
		id: 'mobile-games',
		label: {
			en: 'Playing mobile games',
			fi: 'Mobiilipelien pelaaminen'
		},
		carbonIntensity: 2
	},
	{
		id: 'long-videos',
		label: {
			en: 'Viewing long videos online',
			fi: 'Pitkien videoiden katselu verkossa'
		},
		carbonIntensity: 3
	},
	{
		id: 'short-videos',
		label: {
			en: 'Viewing short videos on social media',
			fi: 'Lyhyiden videoiden katselu sosiaalisessa mediassa'
		},
		carbonIntensity: 3
	},
	{
		id: 'podcasts',
		label: {
			en: 'Listening to podcasts',
			fi: 'Podcastien kuuntelu'
		},
		carbonIntensity: 1
	},
	{
		id: 'streaming-services',
		label: {
			en: 'Viewing streaming services',
			fi: 'Suoratoistopalvelujen katselu'
		},
		carbonIntensity: 3
	},
	{
		id: 'dual-screening',
		label: {
			en: 'Multitasking / dual-screening',
			fi: 'Moniajo / kahden ruudun käyttö'
		},
		carbonIntensity: 2
	},
	{
		id: 'multiple-it-systems',
		label: {
			en: 'Using several IT systems for work',
			fi: 'Useiden IT-järjestelmien käyttö työssä'
		},
		carbonIntensity: 1
	},
	{
		id: 'managing-files',
		label: {
			en: 'Managing files on my device',
			fi: 'Tiedostojen hallinta omalla laitteella'
		},
		carbonIntensity: 1
	},
	{
		id: 'sorting-spam',
		label: {
			en: 'Sorting spam/scam emails',
			fi: 'Roska- ja huijaussähköpostien lajittelu'
		},
		carbonIntensity: 1
	}
];