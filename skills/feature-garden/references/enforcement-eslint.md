# Enforcement with ESLint

## Path Alias

Set up a path alias (`@`) for the root folder so absolute imports work:

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

Configure the same alias in the bundler if it doesn't read tsconfig.json automatically.

## Restrict Cycles

Use [`eslint-plugin-import`](https://www.npmjs.com/package/eslint-plugin-import):

```js
{
  rules: {
    "import/no-cycle": "error",
  },
}
```

## Restrict Dependencies Between Layers

Use [`eslint-plugin-boundaries`](https://www.npmjs.com/package/eslint-plugin-boundaries).

Define elements matching your project's layers and libraries:

```js
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app" }, // Replace with your framework's routing folder
        { type: "feature", pattern: "src/features/*" },
        { type: "shared-feature", pattern: "src/shared-features/*" },
        // Add one entry per library, e.g.:
        // { type: "lib-ui", pattern: "src/libs/ui" },
        // { type: "lib-api", pattern: "src/libs/api" },
        // { type: "lib-domain", pattern: "src/libs/domain" },
      ],
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          checkAllOrigins: true,
          rules: [
            {
              from: { type: "app" },
              allow: { to: { type: ["feature"] } },
              // Add libraries here if the app layer needs provider implementations
            },
            {
              from: { type: ["feature", "shared-feature"] },
              allow: {
                to: {
                  type: ["shared-feature", /* list all lib-* types here */],
                },
              },
            },
            // Add inter-library rules as needed, e.g.:
            // { from: { type: "lib-api" }, allow: { to: { type: "lib-domain" } } },
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
]);
```

## Restrict Dependencies Between Features

Uses built-in `no-restricted-imports` — no plugin needed:

```js
{
  files: ["src/features/**", "src/shared-features/**"],
  rules: {
    "no-restricted-imports": [
      "error",
      {
        patterns: [
          {
            group: ["../**"],
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
}
```

## Optional: Hide Internal Modules Inside Libraries

Create private scopes within a library using `_internal/` folders:

```js
{
  disallow: {
    to: {
      type: ["lib-ui"], // Add libraries that need an _internal folder
      internalPath: "_internal/**",
    },
  },
}
```

## Optional: Hide External Dependencies Behind Libraries

Restrict certain npm packages to specific libraries only:

```js
// Disallow app-wide usage of specific packages
{
  disallow: {
    to: { origin: "external" },
    dependency: { source: ["@heroui/react", "@heroui/styles"] },
  },
},
// Allow them only from a specific library
{
  from: { type: "lib-ui" },
  allow: {
    to: { origin: "external" },
    dependency: { source: ["@heroui/react", "@heroui/styles"] },
  },
}
```

## Checklist: Adding a New Library

When adding a library to `libs/`:

1. Add it to `boundaries/elements`
2. Allow it for `feature` and `shared-feature`
3. Allow other libraries to access it if needed
4. Add `_internal` restriction if needed
5. Hide external dependencies behind it if needed
