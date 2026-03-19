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
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    testTimeout: 20000,
    slowTestThreshold: 20,
}
