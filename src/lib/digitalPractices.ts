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
			en: 'Having multiple devices (e.g. phones)',
			fi: 'Usean eri laitteen käyttö'
		},
		carbonIntensity: 2
	},
	{
		id: 'dual-screening',
		label: {
			en: 'Multitasking / dual-screening',
			fi: 'Usean ruudun samanaikainen käyttö'
		},
		carbonIntensity: 2
	},
	{
		id: 'multiple-it-systems',
		label: {
			en: 'Using several IT systems',
			fi: 'Erilaisten asiointijärjestelmien käyttö'
		},
		carbonIntensity: 1
	},
	{
		id: 'managing-files',
		label: {
			en: 'Managing files on my device',
			fi: 'Tiedostojen hallinnointi laitteilla'
		},
		carbonIntensity: 1
	},
	{
		id: 'too-many-photos',
		label: {
			en: 'Storing too many photos',
			fi: 'Digitaalisten valokuvien varastointi'
		},
		carbonIntensity: 2
	},
	{
		id: 'search-engine',
		label: {
			en: 'Searching for information (with a search engine)',
			fi: 'Tiedon etsintä hakukoneella'
		},
		carbonIntensity: 1
	},
	{
		id: 'collecting-watchlists',
		label: {
			en: 'Collecting a list of things to read or watch',
			fi: 'Katselu-, kuuntelu- ja lukulistojen kerääminen'
		},
		carbonIntensity: 1
	},
	{
		id: 'reading-emails',
		label: {
			en: 'Reading and sorting emails',
			fi: 'Viestiminen sähköpostilla'
		},
		carbonIntensity: 1
	},
	{
		id: 'instant-messaging-groups',
		label: {
			en: 'Instant messaging groups',
			fi: 'Viestiminen pikaviestiryhmissä'
		},
		carbonIntensity: 1
	},
	{
		id: 'reading-news-online',
		label: {
			en: 'Reading the news online',
			fi: 'Uutispalveluiden seuraaminen'
		},
		carbonIntensity: 1
	},
	{
		id: 'scrolling-social-media',
		label: {
			en: 'Scrolling updates on social media',
			fi: 'Kontaktien päivitysten selailu sosiaalisessa mediassa'
		},
		carbonIntensity: 1
	},
	{
		id: 'watching-visual-posts-social-media',
		label: {
			en: 'Watching visual posts on social media',
			fi: 'Kuvasisältöjen selaaminen sosiaalisessa mediassa'
		},
		carbonIntensity: 2
	},
	{
		id: 'podcasts-audio-content',
		label: {
			en: 'Listening to podcasts or other audio content',
			fi: 'Podcastien tai muiden audiosisältöjen kuunteleminen'
		},
		carbonIntensity: 2
	},
	{
		id: 'music-streaming-service',
		label: {
			en: 'Listening to music on a streaming service',
			fi: 'Musiikin kuuntelu suoratoistopalveluista'
		},
		carbonIntensity: 2
	},
	{
		id: 'short-videos',
		label: {
			en: 'Watching short videos on social media',
			fi: 'Lyhyiden videosisältöjen selaaminen sosiaalisessa mediassa'
		},
		carbonIntensity: 3
	},
	{
		id: 'streaming-services',
		label: {
			en: 'Watching streaming services',
			fi: 'Videosisältöjen katselu suoratoistopalveluista'
		},
		carbonIntensity: 3
	},
	{
		id: 'videoconferencing',
		label: {
			en: 'Videoconferencing',
			fi: 'Osallistuminen videopuheluihin'
		},
		carbonIntensity: 3
	},
	{
		id: 'digital-games',
		label: {
			en: 'Playing mobile games',
			fi: 'Digitaalisten pelien pelaaminen'
		},
		carbonIntensity: 2
	},
	{
		id: 'generating-text-ai',
		label: {
			en: 'Generating text with AI',
			fi: 'Tekstin tuottaminen generatiivisella tekoälyä'
		},
		carbonIntensity: 2
	},
	{
		id: 'generating-audiovisual-content-ai',
		label: {
			en: 'Generating audiovisual content with AI',
			fi: 'Audiovisuaalisen sisällön luominen generatiivisella tekoälyllä'
		},
		carbonIntensity: 3
	}
];
