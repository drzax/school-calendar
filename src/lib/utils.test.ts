import { expect, test } from 'vitest';
import { Categories } from './types.d';
import { cleanDescriptionString, inferYears, inferCategories } from './utils';

test('inferCategories - Choral', () => {
	const title = 'Choral Summer Concert - Years 3 to 6';
	const categories = inferCategories(title);
	expect(categories).toEqual([Categories.Choir]);
});

test('inferYears - Year <number>', () => {
	const title = 'Year 6 Choir';
	const years = inferYears(title);
	expect(years).toEqual([6]);
});

test('inferYears - Year<number>', () => {
	const title = 'Year6 Choir';
	const years = inferYears(title);
	expect(years).toEqual([6]);
});

test('inferYears - Yr <number>', () => {
	const title = 'Yr 6- Fort Lytton Excursion (6ME, 6GB & 6SR)';
	const years = inferYears(title);
	expect(years).toEqual([6]);
});

test('inferYears - Yr<number>', () => {
	const title = 'Yr 6- Fort Lytton Excursion (6ME, 6GB & 6SR)';
	const years = inferYears(title);
	expect(years).toEqual([6]);
});

test('inferYears prep', () => {
	const title = 'Prep Bravehearts Ditto Show (TBC)';
	const years = inferYears(title);
	expect(years).toEqual([0]);
});

test('inferYears range Yr <number>-<number>', () => {
	const title = 'Yr 1-3 Parent/Carer-Teacher Interviews (Teams Meeting)';
	const years = inferYears(title);
	expect(years).toEqual([1, 2, 3]);
});

test('inferYears range <number>-<number>', () => {
	const title = 'P-6 Life Education Visit';
	const years = inferYears(title);
	expect(years).toEqual([0, 1, 2, 3, 4, 5, 6]);
});

test('inferYears range Year <number>-<number>', () => {
	const title = 'Year 1-3 Parent/Carer-Teacher Interviews (Teams Meeting)';
	const years = inferYears(title);
	expect(years).toEqual([1, 2, 3]);
});

test('inferYears range Yr <number> - <number>', () => {
	const title = 'Yr 1 - 3 Parent/Carer-Teacher Interviews (Teams Meeting)';
	const years = inferYears(title);
	expect(years).toEqual([1, 2, 3]);
});

test('inferYears range Year <number> - <number>', () => {
	const title = 'Year 1 - 3 Parent/Carer-Teacher Interviews (Teams Meeting)';
	const years = inferYears(title);
	expect(years).toEqual([1, 2, 3]);
});

test('inferYears range Years <number> to <number>', () => {
	const title = 'Choral Winter Concert - Years 3 to 6';
	const years = inferYears(title);
	expect(years).toEqual([3, 4, 5, 6]);
});

test('inferYears range Yr <number> to <number>', () => {
	const title = 'Choral Winter Concert - Yr 3 to 6';
	const years = inferYears(title);
	expect(years).toEqual([3, 4, 5, 6]);
});

test('inferYears list <number>, <number> & <number>', () => {
	const title = 'Year 4,5&6 Swim Carnivals';
	const years = inferYears(title);
	expect(years).toEqual([4, 5, 6]);
});

test('inferYears junior choir', () => {
	const title = 'Junior choir rehearsal';
	const years = inferYears(title);
	expect(years).toEqual([1, 2]);
});

test('inferYears middle choir', () => {
	const title = 'Middle choir rehearsal';
	const years = inferYears(title);
	expect(years).toEqual([3, 4]);
});

test('inferYears senior choir', () => {
	const title = 'Senior choir rehearsal';
	const years = inferYears(title);
	expect(years).toEqual([5, 6]);
});

test('inferYears range with prep', () => {
	const title = 'Prep-3 Swim Carnivals';
	const years = inferYears(title);
	expect(years).toEqual([0, 1, 2, 3]);
});

test('inferYears Yrs 4, 5, 6', () => {
	const title = 'Yrs 4, 5, 6';
	const years = inferYears(title);
	expect(years).toEqual([4, 5, 6]);
});

test('inferYears should not assign 10+ to year 1', () => {
	const title = 'Last day for Year 12 (State High Schools)';
	const years = inferYears(title);
	expect(years).toEqual([]);
});

test('parse API response', () => {
	const data = [
		{
			ID: 846,
			Title: 'Term 2 ends',
			allDayEvent: true,
			attachments: null,
			category: null,
			description: '',
			durationMinutes: 1439,
			durationSeconds: 86340,
			endDate: '2023-06-23T13:59:00Z',
			eventCancelled: false,
			eventContact: null,
			eventDate: '2023-06-22T14:00:00Z',
			eventSummary: null,
			eventType: 0,
			location: 'Queensland',
			recurrenceException: null,
			recurrenceID: null,
			recurrenceRule: null,
			recurring: false,
			uid: null
		},
		{
			ID: 573,
			Title: 'ELEV8 - "CSIRO Crest Award - Blue Crest Club"',
			allDayEvent: false,
			attachments: null,
			category: null,
			description:
				'<html><head><style>\r\n' +
				'p.MsoNormal, li.MsoNormal, div.MsoNormal {\n' +
				'margin:0cm;\n' +
				'margin-bottom:.0001pt;\n' +
				'font-size:11.0pt;\n' +
				'font-family:"Calibri",sans-serif;\n' +
				'}\n' +
				'\n' +
				'a:link, span.MsoHyperlink {\n' +
				'color:#0563C1;\n' +
				'text-decoration:underline;\n' +
				'}\n' +
				'\n' +
				'span.MsoHyperlinkFollowed {\n' +
				'color:#954F72;\n' +
				'text-decoration:underline;\n' +
				'}\n' +
				'\n' +
				'span.EmailStyle17 {\n' +
				'font-family:"Calibri",sans-serif;\n' +
				'color:windowtext;\n' +
				'}\n' +
				'\n' +
				'.MsoChpDefault {\n' +
				'font-family:"Calibri",sans-serif;\n' +
				'}\n' +
				'\n' +
				'div.WordSection1 {\n' +
				'}\n' +
				'</style></head><body lang="EN-AU" link="#0563C1" vlink="#954F72" style=""><div class="WordSection1"><p class="MsoNormal">&#160;</p></div></body></html>',
			durationMinutes: 60,
			durationSeconds: 3600,
			endDate: '2023-06-29T23:00:00Z',
			eventCancelled: false,
			eventContact: null,
			eventDate: '2023-06-29T22:00:00Z',
			eventSummary: null,
			eventType: 5,
			location: 'Tech Hub',
			recurrenceException: '2023-04-06T22:00:00Z;2023-04-13T22:00:00Z',
			recurrenceID: '573.0.2023-06-29T22:00:00Z',
			recurrenceRule: 'FREQ=WEEKLY;BYDAY=;WKST=MO',
			recurring: true,
			uid: '{3B6A84AB-F492-49EC-9082-F18CCDEC7677}'
		}
	];

	// expect(WebsiteAPICalendarFormat.parse())
});

test('strip HTML from description', () => {
	const description =
		'<html><head><style>\r\n' +
		'p.MsoNormal, li.MsoNormal, div.MsoNormal {\n' +
		'margin:0cm;\n' +
		'margin-bottom:.0001pt;\n' +
		'font-size:11.0pt;\n' +
		'font-family:"Calibri",sans-serif;\n' +
		'}\n' +
		'\n' +
		'a:link, span.MsoHyperlink {\n' +
		'color:#0563C1;\n' +
		'text-decoration:underline;\n' +
		'}\n' +
		'\n' +
		'span.MsoHyperlinkFollowed {\n' +
		'color:#954F72;\n' +
		'text-decoration:underline;\n' +
		'}\n' +
		'\n' +
		'span.EmailStyle17 {\n' +
		'font-family:"Calibri",sans-serif;\n' +
		'color:windowtext;\n' +
		'}\n' +
		'\n' +
		'.MsoChpDefault {\n' +
		'font-family:"Calibri",sans-serif;\n' +
		'}\n' +
		'\n' +
		'div.WordSection1 {\n' +
		'}\n' +
		'</style></head><body lang="EN-AU" link="#0563C1" vlink="#954F72" style=""><div class="WordSection1"><p class="MsoNormal">&#160;</p></div></body></html>';

	expect(cleanDescriptionString(description)).toEqual('');
});
