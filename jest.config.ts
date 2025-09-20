export default {
  clearMocks: true,
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!@nestjs/axios)'],
  testMatch: ['<rootDir>/tests/**/*.spec.ts'],
  moduleNameMapper: {
    '@adapters/(.*)': '<rootDir>/src/adapters/$1',
    '@domain/(.*)': '<rootDir>/src/domain/$1',
    '@ports/(.*)': '<rootDir>/src/ports/$1',
    '@tests/(.*)': '<rootDir>/tests/$1'
  },
  setupFiles: ['<rootDir>/tests/utils/environment-variables.ts'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  coveragePathIgnorePatterns: ['<rootDir>/src/infra/libs'],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    global: {
      statements: 30,
      branches: 30,
      functions: 30,
      lines: 30
    }
  },
  transform: {
    '^.+\\.(t|j)s?$': '@swc/jest'
  }
}
