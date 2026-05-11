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
2. Add it to your enforcement config (see [Enforcement checklist](./enforcement-eslint.md#checklist-adding-a-new-library))
3. Document it in `feature-garden.config.yaml`

## Project-Specific Libraries

See `feature-garden.config.yaml` in the project root for this project's concrete libraries.
If the file doesn't exist yet, generate it during project setup (see [Project Setup](./project-setup.md)).

