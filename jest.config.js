/** @type {import('jest').Config} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    rootDir: '.',
    testMatch: ['<rootDir>/src/**/*.spec.ts'],
    testPathIgnorePatterns: ['<rootDir>/test/integration/'],
    moduleFileExtensions: ['ts', 'js', 'json'],
    moduleNameMapper: {
        '^common/(.*)$': '<rootDir>/src/common/$1',
        '^modules/(.*)$': '<rootDir>/src/modules/$1',
        '^app.controller$': '<rootDir>/src/app.controller',
        '^app.module$': '<rootDir>/src/app.module',
    },
    collectCoverageFrom: [
        'src/**/*.ts',
        '!src/main.ts',
        '!src/**/*.module.ts',
        '!src/**/*.dto.ts',
        '!src/**/dto/**',
        '!src/common/types/**',
        '!src/common/constants/**',
    ],
    coverageReporters: ['text', 'lcov', 'cobertura'],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 75,
            lines: 75,
            statements: 75,
        },
    },
    testTimeout: 20000,
    slowTestThreshold: 20,
}
