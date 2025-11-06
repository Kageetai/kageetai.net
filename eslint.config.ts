import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import css from "@eslint/css";
import { defineConfig, globalIgnores } from "eslint/config";
import eslintPluginAstro from "eslint-plugin-astro";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx,astro}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },
  globalIgnores([".astro/**/*", "dist/"], "Ignore Build Directory"),
]);
