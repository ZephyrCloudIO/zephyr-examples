import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import qwik from "eslint-plugin-qwik";

export default [
  {
    ignores: [
      "**/*.log",
      "**/.DS_Store",
      "*.d.ts",
      ".vscode/settings.json",
      ".history/**",
      ".yarn/**",
      "bazel-*/**",
      "dist/**",
      "dist-dev/**",
      "lib/**",
      "lib-types/**",
      "etc/**",
      "external/**",
      "node_modules/**",
      "temp/**",
      "tsc-out/**",
      "tsdoc-metadata.json",
      "target/**",
      "output/**",
      "rollup.config.js",
      "build/**",
      ".cache/**",
      ".vscode/**",
      ".rollup.cache/**",
      "tsconfig.tsbuildinfo",
      "vite.config.ts",
      "*.spec.tsx",
      "*.spec.ts",
      ".netlify/**",
      "pnpm-lock.yaml",
      "package-lock.json",
      "yarn.lock",
      "server/**"
    ]
  },
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: "./tsconfig.json",
        ecmaVersion: 2021,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      "@typescript-eslint": typescript,
      "qwik": qwik
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...qwik.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-inferrable-types": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "prefer-spread": "off",
      "no-case-declarations": "off",
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": ["error"],
      "@typescript-eslint/consistent-type-imports": "warn",
      "@typescript-eslint/no-unnecessary-condition": "warn"
    }
  }
];