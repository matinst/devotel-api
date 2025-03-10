module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  env: {
    es6: true,
    node: true,
  },
  rules: {
    // turn on errors for missing imports
    "sort-imports": [
      "error",
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        allowSeparatedGroups: true,
      },
    ],
    "import/no-unresolved": "error",
    "import/order": [
      "error",
      {
        groups: ["builtin", "external", "internal", ["sibling", "parent"], "index", "unknown"],
        "newlines-between": "always",
        alphabetize: {
          /* sort in ascending order. Options: ["ignore", "asc", "desc"] */
          order: "asc",
          /* ignore case. Options: [true, false] */
          caseInsensitive: true,
        },
      },
    ],

    // JavaScript Rules
    "no-var": "error",
    "prefer-const": "error",
    "no-multi-spaces": "error",
    "space-in-parens": "error",
    "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
    semi: ["error", "always"],

    // Best Practices
    "no-async-promise-executor": "warn",
    "no-control-regex": "warn",
    "no-empty": ["warn", { allowEmptyCatch: true }],
    "no-extra-semi": "warn",
    "no-prototype-builtins": "warn",
    "no-regex-spaces": "warn",
    "prefer-rest-params": "warn",
    "prefer-spread": "warn",

    // TypeScript-Specific Rules
    "@typescript-eslint/ban-ts-comment": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-loss-of-precision": "warn",
    "@typescript-eslint/no-misused-new": "warn",
    "@typescript-eslint/no-namespace": "warn",
    "@typescript-eslint/no-this-alias": "warn",
    "@typescript-eslint/no-unnecessary-type-constraint": "warn",
    "@typescript-eslint/no-unsafe-declaration-merging": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        ignoreRestSiblings: true,
      },
    ],
    "@typescript-eslint/no-var-requires": "warn",
    "@typescript-eslint/triple-slash-reference": "warn",

    // "@typescript-eslint/explicit-function-return-type": [
    //   "warn",
    //   {
    //     allowExpressions: true,
    //     allowTypedFunctionExpressions: true,
    //   },
    // ],
    // "@typescript-eslint/no-inferrable-types": "warn",
    // "@typescript-eslint/no-non-null-assertion": "warn",
  },
};
