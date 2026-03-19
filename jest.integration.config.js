/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    testMatch: ['<rootDir>/test/integration/**/*.spec.ts'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    moduleNameMapper: {
        '^common/(.*)$': '<rootDir>/src/common/$1',
        '^modules/(.*)$': '<rootDir>/src/modules/$1',
        '^app.controller$': '<rootDir>/src/app.controller',
        '^app.module$': '<rootDir>/src/app.module',
    },
    globalSetup: '<rootDir>/test/integration/global-setup.ts',
    globalTeardown: '<rootDir>/test/integration/global-teardown.ts',
    setupFilesAfterEnv: ['<rootDir>/test/integration/jest.setup.ts'],
    testTimeout: 30000,
    collectCoverage: false,
}
