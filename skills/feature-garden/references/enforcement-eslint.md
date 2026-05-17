# Enforcement with ESLint

> **Idempotency:** Skip any step whose outcome already exists in the project.

## Step 1 — Path Alias

**Goal:** Enable absolute imports via `@/` prefix.

Add to `tsconfig.json` (use conventions appropriate for the project's TypeScript version):

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**IF** the bundler does NOT read `tsconfig.json` paths automatically, **THEN** also configure the alias in the bundler.

Vite example:
```js
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
});
```

## Step 2 — ESLint Config

**Reference config:** [assets/eslint.config.js](../assets/eslint.config.js)

### Determine Project Type

- **New project:** No application code exists yet (greenfield or only scaffolding).
- **Existing project:** Application code already exists that was written without Feature Garden.

### Copy or Patch

- **IF** no ESLint config exists → copy the reference config as-is.
- **IF** ESLint config already exists → patch it minimally to achieve the same boundary rules. Do not rewrite unrelated settings.

### Project-Specific Adjustments

1. **`boundaries/elements`** — Set `app` patterns to match the framework's routing/composition folders (e.g., `src/app` for Next.js, `src/routes` for TanStack Start). IF the project is existing, add all pre-existing project structure folders to the `app` type.
2. **`boundaries/dependencies`** — IF the project is new, remove library types from the `app` allow list. IF the project is existing, keep all libraries allowed from `app`.
3. **Library types** — Remove any `lib-*` types from the config that are NOT listed in `feature-garden.config.yaml`.
4. **`boundaries/ignore`** — Update ignored files to match project entry points (e.g., `src/main.ts`, `src/index.tsx`, `src/vite-env.d.ts`).

**Install dependencies:** Install all packages required by the config via the project's package manager.

**Validate:** Run [scripts/test-boundaries.mjs](../scripts/test-boundaries.mjs) — all checks must pass.

## Step 3 — Hide Internal Modules (Optional)

> **ASK the user:** "Do you want `_internal/` scopes in any libraries?"
> Proceed ONLY if the user says yes.

Add a disallow rule to `boundaries/dependencies` for each library that needs private internals:

```js
{
  disallow: {
    to: {
      type: ["lib-ui"], // list libraries that have _internal/ folders
      internalPath: "_internal/**",
    },
  },
}
```

## Step 4 — Hide External Dependencies Behind Libraries (Optional)

> **ASK the user:** "Do you want to restrict any external packages to specific libraries only?"
> Proceed ONLY if the user says yes.

Add two rules to `boundaries/dependencies` — one to disallow globally, one to allow from the owning library:

```js
// 1. Disallow these packages globally
{
  disallow: {
    to: { origin: "external" },
    dependency: { source: ["@heroui/react", "@heroui/styles"] },
  },
},
// 2. Allow them only from the designated library
{
  from: { type: "lib-ui" },
  allow: {
    to: { origin: "external" },
    dependency: { source: ["@heroui/react", "@heroui/styles"] },
  },
}
```

Replace package names and library type with actual values for the project.

## Checklist: Adding a New Library

When a new library is added to `libs/`, update the ESLint config:

1. Add a `boundaries/elements` entry with pattern `src/libs/<name>`.
2. In `boundaries/dependencies`, allow `feature` and `shared-feature` to import it.
3. IF other libraries depend on it, add allow rules for those too.
4. IF it has private internals, add a `_internal` disallow rule (Step 3).
5. IF it wraps external packages, add disallow/allow rules (Step 4).
