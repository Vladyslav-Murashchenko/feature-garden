import boundaries from "eslint-plugin-boundaries";
import { strict as strictBoundaries } from "eslint-plugin-boundaries/config";
import { importX } from "eslint-plugin-import-x";
import { defineConfig } from "eslint/config";
import { configs as tsconfigs } from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["**", "!src/**"],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  ...tsconfigs.strictTypeChecked,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  {
    rules: {
      "import-x/no-cycle": "error",
    },
  },
  {
    plugins: { boundaries },
    settings: {
      "import/resolver": {
        typescript: true,
      },
      ...strictBoundaries.settings,
      "boundaries/elements": [
        { type: "app", pattern: "src/pages" },
        { type: "app", pattern: "src/utils" },
        { type: "app", pattern: "src/App.tsx", mode: "file" },
        { type: "feature", pattern: "src/features/*" },
        { type: "shared-feature", pattern: "src/shared-features/*" },
        { type: "lib-domain", pattern: "src/libs/domain" },
        { type: "lib-ui", pattern: "src/libs/ui" },
        { type: "lib-api", pattern: "src/libs/api" },
      ],
      "boundaries/ignore": ["src/index.tsx", "src/vite-env.d.ts"],
    },
    rules: {
      ...strictBoundaries.rules,
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          checkAllOrigins: true,
          rules: [
            {
              from: { type: "app" },
              allow: {
                to: {
                  type: ["app", "feature", "lib-domain", "lib-ui", "lib-api"],
                },
              },
            },
            {
              from: { type: ["feature", "shared-feature"] },
              allow: {
                to: {
                  type: ["shared-feature", "lib-domain", "lib-ui", "lib-api"],
                },
              },
            },
            {
              from: { type: "lib-api" },
              allow: { to: { type: ["lib-domain"] } },
            },
            {
              disallow: {
                to: {
                  type: ["feature", "shared-feature"],
                  internalPath: "!index.ts",
                },
              },
            },
            { allow: { to: { origin: "external" } } },
          ],
        },
      ],
    },
  },
  {
    files: ["src/features/**", "src/shared-features/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["..**"],
              message:
                "Features cannot import from parent directories. Use absolute imports to access libraries and shared features.",
            },
            {
              group: ["./*/**"],
              message:
                "Nested features can only be imported through their public entry point (index.ts).",
            },
            {
              group: ["@/features/**"],
              message:
                "Features cannot import from the root features folder. Use a relative import to access a child feature.",
            },
          ],
        },
      ],
    },
  },
]);
