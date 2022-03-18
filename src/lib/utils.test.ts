import { inferYears } from './utils';

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
