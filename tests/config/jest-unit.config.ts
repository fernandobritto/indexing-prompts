import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  moduleNameMapper: {
    '@adapters/(.*)': '<rootDir>/src/adapters/$1',
    '@domain/(.*)': '<rootDir>/src/domain/$1',
    '@ports/(.*)': '<rootDir>/src/ports/$1',
    '@tests/(.*)': '<rootDir>/tests/$1'
  },
  // globalSetup: '<rootDir>/test/config/integration/setup.ts',
  // globalTeardown: '<rootDir>/test/config/integration/teardown.ts',
  testTimeout: 60000,
  rootDir: '../../',
  testEnvironment: 'node',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  collectCoverage: true,
  coverageReporters: ['lcov', 'text'],
  coverageProvider: 'v8',
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/tests/',
    'jest.config.ts',
    '/src/infra/database/',
    '/src/middlewares/',
    '.eslintrc',
    '/coverage/',
    '\\.entity\\.ts$',
    '\\.dto\\.ts$',
    '\\.controller\\.ts$',
    '/src\\/app\\/\\S*\\.module\\.ts$',
    '/src/infra/config/',
    '/src/domain/infra/config/',
    '/src/domain/errors',
    '/src/@types/',
    'webpack.config.js',
    '.webpack'
  ],
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
}

export default jestConfig
