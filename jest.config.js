/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	setupFilesAfterEnv: ['./jest.env.ts'],
	// globalTeardown: './jest.teardown.ts',
	// globalSetup: './jest.setup.ts',
};
