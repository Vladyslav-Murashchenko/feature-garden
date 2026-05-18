# Libraries

## Purpose

Libraries provide low-level building blocks and serve as the primary mechanism for code reuse across features.
They can also encapsulate implementation details (such as external dependencies) and hide them from the rest of the application.

## When to Create a Library

Before creating a new library, check whether the module fits into an existing one.
Libraries should have a clear, single responsibility — if the module aligns with an existing library's concern, place it there.

Create a new library only when:
- The module needs to be reused across features
- It represents a well-defined concern that doesn't belong to any existing library
- It would violate an existing library's single responsibility to include it

Avoid generic libraries like `utils`, `helpers`, `components`, or `hooks` — they accumulate unrelated responsibilities over time.

## Structuring a Library

To prevent libraries from becoming messy, split them into **vertical slices**.
Each slice should have a clear responsibility — typically aligned with domain entities or use cases.

Slices do not need to be consistent across libraries — each library uses a strategy that fits its purpose.

## Dependencies Between Libraries

Libraries are typically independent and unaware of each other.
However, explicit dependencies between libraries are allowed when necessary (e.g., api → domain).

Define inter-library dependency directions explicitly and enforce them via ESLint.
See [Enforcement (ESLint)](./enforcement-eslint.md).

## Adding a New Library

1. Create a folder under `libs/` with a clear, responsibility-based name
2. Document it in `feature-garden.config.yaml`
3. Update the ESLint config:
   1. Add a `boundaries/elements` entry with pattern `src/libs/<name>`.
   2. In `boundaries/dependencies`, allow `feature` and `shared-feature` to import it.
   3. IF other libraries depend on it, add allow rules for those too.
   4. IF it has private internals, add a `_internal` disallow rule (Step 3).
   5. IF it wraps external packages, add disallow/allow rules (Step 4).

## Project-Specific Libraries

See `feature-garden.config.yaml` in the project root for this project's concrete libraries.


