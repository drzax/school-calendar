import { expect, test } from 'vitest';
import { getDateArray, makeDayjsObj } from './datetime';
import { TIMEZONE } from './constants';

// Unit tests are deliberately run in a timezone that isn't Brisbane or UTC.
// Perth has been chosen for arbitrary reasons and because it does not
// observe daylight savings time, so tests should run successfully all year
// round. This tests to make sure the TZ environment variable has been set
// when running tests.
test('timezone', () => {
	const today = new Date();
	// Perth is UTC+8 which means the timezone offset will be -8 * 60 = -480
	expect(today.getTimezoneOffset()).toBe(-480);
});

test('makeDayJsObj no timezone', () => {
	const date = makeDayjsObj('2023-05-01T00:00:00');
	expect(date.toISOString()).toEqual('2023-04-30T14:00:00.000Z');
});
test('makeDayJsObj no timezone or time', () => {
	const date = makeDayjsObj('2023-05-01');
	expect(date.toISOString()).toEqual('2023-04-30T14:00:00.000Z');
});
test('makeDayJsObj UTC', () => {
	const date = makeDayjsObj('2023-05-01T00:00:00Z');
	expect(date.toISOString()).toEqual('2023-05-01T00:00:00.000Z');
});
test('makeDayJsObj offset', () => {
	const date = makeDayjsObj('2023-05-01T00:00:00+0500');
	expect(date.toISOString()).toEqual('2023-04-30T19:00:00.000Z');
});
test('makeDayJsObj output timezone', () => {
	const date = makeDayjsObj('2023-05-01T00:00:00+0500');
	expect(date.tz(TIMEZONE).toISOString()).toEqual('2023-04-30T19:00:00.000Z');
});

test('getDateArray all day event', () => {
	const date = makeDayjsObj('2023-05-01');
	expect(getDateArray(date, true)).toEqual([2023, 5, 1]);
});

test('getDateArray timed event', () => {
	// no tz info, Brisbane should be assumed
	// output should be in UTC
	const date = makeDayjsObj('2023-05-01T15:30');
	expect(getDateArray(date, false)).toEqual([2023, 5, 1, 5, 30]);
});

test('getDateArray timed event with TZ info', () => {
	// tz info, so it should be used
	// output should be in UTC
	const date = makeDayjsObj('2023-05-01T15:30Z');
	expect(getDateArray(date, false)).toEqual([2023, 5, 1, 15, 30]);
});
