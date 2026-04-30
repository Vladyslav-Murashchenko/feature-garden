# Feature Garden Enforcement Guide

The architecture should not rely solely on discipline. Without tooling-based enforcement, it is easy to accidentally violate Feature Garden's rules.

Feature Garden intentionally does not provide a ready-to-use npm package for enforcing the architecture. Architectural rules should remain under your full control, because every codebase has its own libraries, tooling, and trade-offs.

Instead, this guide describes an ESLint-based enforcement approach. However, you can apply the same rules using another tool of your choice.

**Initial setup:**
- [Set up an alias to the root folder](#set-up-an-alias-to-the-root-folder)
- [Restrict cycles](#restrict-cycles)
- [Restrict dependencies between layers and libraries](#restrict-dependencies-between-layers-and-libraries)
- [Restrict dependencies between features](#restrict-dependencies-between-features)

**Optional extensions:**
- [Hide internal modules inside libraries](#hide-internal-modules-inside-libraries)
- [Hide external dependencies behind libraries](#hide-external-dependencies-behind-libraries)

**Scaling:**
- [Extend with new libraries](#extend-with-new-libraries)

## Set up an alias to the root folder

When importing from another root folder, always use an absolute path.
To make this possible, first set up a path alias for the root folder.

The common name for the root folder alias is `@`.
You can choose another alias, but this guide uses `@` in the examples.

For TypeScript projects, the alias is usually configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

If your framework or bundler does not read tsconfig.json aliases automatically, configure the same alias in the bundler as well.

## Restrict cycles

One of the most important Feature Garden rules is that the dependency graph should not contain cycles.

This can be enforced with [`eslint-plugin-import`](https://www.npmjs.com/package/eslint-plugin-import).

Follow the official guide to set up the plugin. Then add the `import/no-cycle` rule:

```js
const eslintConfig = defineConfig([
  // Your other rules
  {
    rules: {
      "import/no-cycle": "error",
    },
  },
]);
```

Make sure the rule works for both relative and absolute imports.

## Restrict dependencies between layers and libraries

Let's define the core dependency directions.

This example uses [`eslint-plugin-boundaries`](https://www.npmjs.com/package/eslint-plugin-boundaries) and assumes the [recommended Feature Garden libraries](./engineering-guide.md#what-libraries-to-start-with).

Feel free to customize the configuration for your own libraries:

```js
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  // Your other rules
  {
    plugins: { boundaries },
    settings: {
      "boundaries/elements": [
        { type: "app", pattern: "src/app" }, // Replace "src/app" with your framework's routing folder.
        { type: "feature", pattern: "src/features/*" },
        { type: "shared-feature", pattern: "src/shared-features/*" },
        { type: "lib-ui", pattern: "src/libs/ui" },
        { type: "lib-api", pattern: "src/libs/api" },
        { type: "lib-domain", pattern: "src/libs/domain" },
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
              allow: { to: { type: ["feature"] } }, // Add libraries here if the app layer needs to use some provider implementations.
            },
            {
              from: { type: ["feature", "shared-feature"] },
              allow: {
                to: {
                  type: [
                    "shared-feature",
                    "lib-ui",
                    "lib-api",
                    "lib-domain",
                  ],
                },
              },
            },
            {
              from: { type: "lib-api" },
              allow: { to: { type: "lib-domain" } },
            },
            {
              disallow: {
                to: {
                  type: ["feature", "shared-feature"],
                  internalPath: "!index.ts",
                },
              },
            },
            { allow: { to: { origin: "external" } } }, // Allow all external dependencies by default.
          ],
        },
      ],
    },
  },
]);
```

## Restrict dependencies between features

Now it is time to make nested features independent from each other.

We will use `no-restricted-imports`, a built-in ESLint rule. No additional plugin is required.

```js
const eslintConfig = defineConfig([
  // Your other rules
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
                "Nested features can only be imported through their public entry point. Import from index.ts instead.",
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
```

The initial setup is done.

However, I recommend looking through the following sections as well, as some may be useful from the start.

## Hide internal modules inside libraries

By default, all library modules are globally accessible. However, you might sometimes need to create a private scope within a library.
You can achieve this by configuring ESLint:
```js
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  // Your other rules
  {
    plugins: { boundaries },
    settings: {
    // Skip settings for this example
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          checkAllOrigins: true,
          rules: [
            // All previous rules
            {
              disallow: {
                to: {
                  type: ["lib-ui"], // Add all libraries that should have an _internal folder here.
                  internalPath: "_internal/**",
                },
              },
            },
          ],
        },
      ],
    },
  },
]);
```

## Hide external dependencies behind libraries

Before adding an external library, decide whether your project should depend on it fully.
If not, hide the dependency behind an internal library.
Here is an example of how to do it with ESLint:

```js
import boundaries from "eslint-plugin-boundaries";

const eslintConfig = defineConfig([
  // Your other rules
  {
    plugins: { boundaries },
    settings: {
    // Skip settings for this example
    },
    rules: {
      "boundaries/dependencies": [
        "error",
        {
          default: "disallow",
          checkAllOrigins: true,
          rules: [
            // All previous rules
            { allow: { to: { origin: "external" } } }, // Allow all external dependencies by default.
            {
              disallow: {
                to: { origin: "external" },
                dependency: {
                  source: [
                    "@heroui/react", // Add dependencies here if they should not be app-wide.
                    "@heroui/styles",
                  ],
                },
              },
            },
            {
              from: { type: "lib-ui" }, // Allow these dependencies to be used only from a specific library.
              allow: {
                to: { origin: "external" },
                dependency: { source: ["@heroui/react", "@heroui/styles"] }, 
              },
            },
          ],
        },
      ],
    },
  },
]);
```

## Extend with new libraries

When adding a new library to the `libs` folder, don't forget to add it to your enforcement config.
For ESLint with the configuration above, follow this checklist:

- Add library to `boundaries/elements.`
- Allow it for `feature` and `shared-feature.`
- Allow other libraries to access it if needed
- Add it to the list of libraries with an internal path if needed
- Hide external dependency behind the library if needed










