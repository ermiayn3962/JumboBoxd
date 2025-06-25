import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";


export default defineConfig([
  { files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "script",
      globals: globals.node,
    },
    plugins: { js },
    rules: {
      ...js.configs.recommended.rules,
      'curly': 'error',                 // Enforces curly braces for all control statements
      'semi': ['error', 'always'],      // Enforces semicolons at the end of statements
      'quotes': ['error', 'single'],    // Enforces single quotes
      'comma-dangle': ['error', 'never'], // Disallows trailing commas
    },
  }
]);
