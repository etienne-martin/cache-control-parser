module.exports = {
  ignorePatterns: ["dist/", "coverage/"],
  parser: "@typescript-eslint/parser",
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint"],
  env: {
    es2020: true,
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
  },
  overrides: [
    {
      files: ["**/*.js"],
      rules: {
        "@typescript-eslint/no-require-imports": 0,
      },
    },
  ],
  rules: {
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-namespace": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "no-console": ["error"],
  },
};
