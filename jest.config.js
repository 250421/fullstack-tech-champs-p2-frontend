export default {
  globals: {
    "ts-jest": {
      tsconfig: false,
       useESM: true,
      babelConfig: true,
    },
  },

  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts',
    '!**/vendor/**'],
  coverageDirectory: 'coverage',
  testEnvironment: "jest-environment-jsdom",
  preset: 'ts-jest',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    "^.+\\.[t|j]sx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "routeTree.gen.ts",
  ],

  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
    "^.+\\.svg$": "jest-transformer-svg",
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/coverage",
    "package.json",
    "package-lock.json",
    "reportWebVitals.ts",
    "setupTests.ts",
    "index.tsx",
    "/components/ui/",
    "axios-config.ts",
    "routeTree.gen.ts"
  ],
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

}

