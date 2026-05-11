# Migration

Strategy for migrating modules from a legacy codebase into Feature Garden.

## Prerequisites

Feature Garden must already be initialized in the project (see [Project Setup](./project-setup.md)).

An additional boundary must be enforced:
- Feature Garden code (`features`, `shared-features`, `libs`) must not import from the legacy codebase.
- Legacy code is allowed to import from Feature Garden.
- Treat all legacy code as part of the app layer.

This forces reusable logic to flow into Feature Garden, not the other way around.

## When to Migrate a Module

Do not migrate proactively. Migrate only when:
- A legacy feature requires a major update — consider migrating it to `features/` instead of extending it in the legacy structure.
- A piece of logic is needed by new Feature Garden code — extract it into the appropriate library.

Avoid rewriting features just for the sake of migration.

## Migrating a Large Feature

For a large feature, migrate incrementally:

1. Create a dedicated folder inside `features/`.
2. Start with one module. Identify its dependencies and move required dependencies first.
3. Decide [where each module should live](./module-placement.md) and move it to the appropriate place.
4. During initial migration, it is acceptable for the feature to expose a wider public API so migrated modules can still be used by legacy code.
5. Over time, as more code moves into Feature Garden, reorganize into nested features and shrink the public API.

## Steps for Migrating a Module

1. Identify the module's responsibility — is it domain logic, data access, UI, or feature composition?
2. Decide the target location using [Module Placement](./module-placement.md).
3. Move the module into the target location, following Feature Garden rules.
4. Update legacy callers to import from the new location.
5. Delete the legacy module.
6. If the migration introduces a new library, document it in `feature-garden.config.yaml`.

## Avoid

- Mixing migration with new functionality in the same commit.
- Importing legacy code from Feature Garden modules (must stay one-way).
- Migrating modules that don't need updates — they can stay in legacy until a real reason appears.
