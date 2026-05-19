# Enforcement with ESLint

> **Idempotency:** Skip any step whose outcome already exists in the project.

## Step 1 — Path Alias

**Goal:** Enable absolute imports via `@/` prefix.

Add to `tsconfig.json` (no need deprecated "baseUrl": "." for TypeScript 6+):

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
- **IF** use eslint-plugin-import-x, use it explicitly as in reference config.
- **IF** the framework requires additional ESLint parsers or framework-specific configuration (e.g. `vue-eslint-parser` for Vue), install and configure them.

### Project-Specific Adjustments

1. **`boundaries/elements`** — Set `app` patterns to match the framework's routing/composition folders (e.g., `app` for Next.js, `src/routes` for TanStack Start). IF existing project, add all pre-existing project structure folders to the `app` type.
2. **`boundaries/dependencies`** — IF new project, remove library types from the `app` allow list. IF existing project, keep all libraries allowed from `app`.
3. **Library types** — Remove any `lib-*` types from the config that are NOT listed in `feature-garden.config.yaml`.
4. **`boundaries/ignore`** — Update ignored files to match project entry points (e.g., `src/main.ts`, `src/index.tsx`, `src/vite-env.d.ts`).

**Install dependencies:** Install all packages required by the config via the project's package manager. Don't miss eslint-import-resolver-typescript.

### Validate (mandatory — do not skip)

- Run [scripts/test-boundaries.mjs](../scripts/test-boundaries.mjs) — all checks must pass.
- IF new project, run the linter — it must report zero errors.

