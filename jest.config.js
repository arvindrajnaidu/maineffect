module.exports = {
    testEnvironment: 'jest-environment-jsdom',
    collectCoverageFrom: [
        '**/examples/**/*.js'
    ],
    //   modulePathIgnorePatterns: [
    //     'examples/.*',
    //     'packages/.*/build',
    //     'packages/.*/tsconfig.*',
    //     'packages/jest-runtime/src/__tests__/test_root.*',
    //     'website/.*',
    //     'e2e/runtime-internal-module-registry/__mocks__',
    //   ],
    // projects: ['<rootDir>', '<rootDir>/src/examples/*/'],
}