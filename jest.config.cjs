/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
	preset: 'ts-jest/presets/default-esm',
	testEnvironment: 'node',
	testPathIgnorePatterns: ['/node_modules/', '/tests/'],
	moduleNameMapper: {
		'^\\$lib/(.*)': '<rootDir>/src/lib/$1'
	}
};
