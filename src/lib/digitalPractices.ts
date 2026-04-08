export type CarbonIntensity = 1 | 2 | 3;

export interface DigitalPractice {
	id: string;
	label: string;
	carbonIntensity: CarbonIntensity;
}

export const digitalPractices: DigitalPractice[] = [
	{
		id: 'multiple-devices',
		label: 'Forced to use multiple devices (e.g. phones)',
		carbonIntensity: 2
	},
	{
		id: 'collecting-watchlists',
		label: 'Collecting a list of things to read or watch',
		carbonIntensity: 1
	},
	{
		id: 'videoconferencing',
		label: 'Videoconferencing',
		carbonIntensity: 3
	},
	{
		id: 'video-ads-social',
		label: 'Forced to view video ads on social media',
		carbonIntensity: 2
	},
	{
		id: 'scrolling-social-media',
		label: 'Scrolling social media',
		carbonIntensity: 2
	},
	{
		id: 'instant-messaging-groups',
		label: 'Instant messaging groups',
		carbonIntensity: 1
	},
	{
		id: 'too-many-photos',
		label: 'Storing too many photos',
		carbonIntensity: 2
	},
	{
		id: 'audio-books',
		label: 'Listening to audio books',
		carbonIntensity: 1
	},
	{
		id: 'search-engine',
		label: 'Searching for information (with a search engine)',
		carbonIntensity: 1
	},
	{
		id: 'algorithmic-recommendations',
		label: 'Viewing content recommended by algorithm',
		carbonIntensity: 2
	},
	{
		id: 'work-reading-after-hours',
		label: 'Reading work-related things outside work hours',
		carbonIntensity: 1
	},
	{
		id: 'reading-emails',
		label: 'Reading emails',
		carbonIntensity: 1
	},
	{
		id: 'mobile-games',
		label: 'Playing mobile games',
		carbonIntensity: 2
	},
	{
		id: 'long-videos',
		label: 'Viewing long videos online',
		carbonIntensity: 3
	},
	{
		id: 'short-videos',
		label: 'Viewing short videos on social media',
		carbonIntensity: 3
	},
	{
		id: 'podcasts',
		label: 'Listening to podcasts',
		carbonIntensity: 1
	},
	{
		id: 'streaming-services',
		label: 'Viewing streaming services',
		carbonIntensity: 3
	},
	{
		id: 'dual-screening',
		label: 'Multitasking / dual-screening',
		carbonIntensity: 2
	},
	{
		id: 'multiple-it-systems',
		label: 'Using several IT systems for work',
		carbonIntensity: 1
	},
	{
		id: 'managing-files',
		label: 'Managing files on my device',
		carbonIntensity: 1
	},
	{
		id: 'sorting-spam',
		label: 'Sorting spam/scam emails',
		carbonIntensity: 1
	}
];