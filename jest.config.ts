export default {
  clearMocks: true,
  testEnvironment: 'node',
  testMatch: ['<rootDir>/tests/**/*.spec.ts'],
  moduleNameMapper: {
    '@common/(.*)': '<rootDir>/source/common/$1',
    '@functions/(.*)': '<rootDir>/source/functions/$1',
    '@helpers/(.*)': '<rootDir>/source/helpers/$1',
    '@tests/(.*)': '<rootDir>/tests/$1'
  },
  setupFiles: ['<rootDir>/tests/utils/environment-variables.ts'],
  collectCoverageFrom: ['<rootDir>/source/**/*.ts'],
  coveragePathIgnorePatterns: ['<rootDir>/source/definitions/*'],
  testPathIgnorePatterns: ['/node_modules/'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 60,
      functions: 60,
      lines: 60
    }
  },
  transform: {
    '^.+\\.(t|j)s?$': '@swc/jest'
  }
}
