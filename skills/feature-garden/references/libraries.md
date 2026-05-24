# Libraries

## Purpose

Libraries provide reusable building blocks and are the primary mechanism for sharing code across features.

Each library represents a clear application concern, such as UI, API, or domain.

They encapsulate implementation details, such as external libraries, infrastructure-specific logic, or domain knowledge, hiding them from the rest of the application by acting as facades or adapters.

Libraries are typically independent and unaware of each other. However, dependencies between libraries are allowed. Use the project's ESLint config as the source of truth for allowed library dependencies.

## Structuring a Library

To prevent libraries from becoming messy, split them into **vertical slices**.
Each slice should have a clear responsibility — typically aligned with domain entities or use cases.

Slices do not need to be consistent across libraries — each library uses a strategy that fits its purpose.

Libraries do not have `index.ts` files. All modules in a library are public by default, unless they are explicitly marked private.

## Hiding Details

To make a module private inside a library, prefix the file name with `_`, for example `_db.ts`.

To make an external library private inside a library, use [Hide External Dependency](./hide-external-dependency.md).

## Adding a New Library

Before creating a new library, ask the user:

- What is the library name?
- What is the intent of the library?
- What can the library do?
- What cannot the library do?
- Do you want to hide external dependencies behind this library?

1. Create a folder under `libs/` with a library name
2. Document it in `feature-garden.config.yaml`
3. Update the ESLint config:
   1. Add a `boundaries/elements` entry with pattern `src/libs/<name>`.
   2. In `boundaries/dependencies`, allow `feature` and `shared-feature` to import it.
   3. IF other libraries depend on it, add allow rules for those too.
   4. IF it wraps external packages, add disallow/allow rules. See [Hide External Dependency](./hide-external-dependency.md).

## Project-Specific Libraries

See `feature-garden.config.yaml` in the project root for this project's concrete libraries.
