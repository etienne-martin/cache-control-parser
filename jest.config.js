module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  moduleFileExtensions: ["ts", "js", "json", "node"],
  coveragePathIgnorePatterns: ["/node_modules/", "/coverage/", "/dist/"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testMatch: ["**/*.test.ts"],
  collectCoverageFrom: ["src/**/*.ts"],
};
