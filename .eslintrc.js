module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: ["airbnb-typescript/base", "prettier"],
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "prefer-const": "error",
    "no-const-assign": "error",
    quotes: "off",
    "@typescript-eslint/quotes": [
      "warn",
      "double",
      {
        allowTemplateLiterals: true,
      },
    ],
    "prettier/prettier": ["error"],
    "import/prefer-default-export": "off", // Allow single Named-export
  },
};
