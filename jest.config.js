module.exports = {
  testURL: "http://localhost/",
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  coveragePathIgnorePatterns: ["/node_modules/", "/coverage/", "/dist/"],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },
  testMatch: ["**/?(*.)(test).(tsx|ts)"],
  collectCoverageFrom: ["src/**/*.(tsx|ts)"]
};
