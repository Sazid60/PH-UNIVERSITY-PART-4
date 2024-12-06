import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";


/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ["node_modules", "dist"], // Directories to be ignored by the linter.
    rules: {
      "no-unused-vars": "error",         // Disallow variables that are declared but never used.
      "no-unused-expressions": "error", // Disallow standalone expressions that do nothing.
      "prefer-const": "error",         // Prefer `const` over `let` for variables that are not reassigned.
      "no-console": "warn",         // Warn when `console` statements are used (e.g., console.log).
      "no-undef": "error" //if anything is not used show error
    },
  }
];