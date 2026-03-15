import type { Config } from "jest";

const config: Config = {
  preset: "jest-expo",
  setupFilesAfterEnv: ["./jest.setup.ts"],
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|date-fns)",
  ],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  testMatch: ["**/__tests__/**/*.(test|spec).(ts|tsx)"],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/assets/",
    "jest.config.ts",
    "jest.setup.ts",
  ],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/types/**",
    "!src/constants/**",
  ],
};

export default config;
