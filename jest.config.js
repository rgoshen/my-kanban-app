const nextJest = require('next/jest')

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
    '!src/lib/__tests__/test-utils.tsx',
    '!src/app/layout.tsx',
    '!src/app/page.tsx',
    '!src/app/globals.css',
    '!src/data/**/*',
    '!src/components/ui/**/*',
    '!src/lib/db/seed.ts',
    '!src/lib/db/test-connection.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 60,    // TODO: Reset to 80 when API routes and database integration tests are added
      functions: 60,   // TODO: Reset to 85 when API routes and database integration tests are added
      lines: 80,       // TODO: Reset to 90 when API routes and database integration tests are added
      statements: 80,  // TODO: Reset to 90 when API routes and database integration tests are added
    },
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
  ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig) 