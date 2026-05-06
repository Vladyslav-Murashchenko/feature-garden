# Migration

Strategy for migrating a particular module from a legacy codebase into Feature Garden.

## Prerequisites

Feature Garden must already be initialized in the project (see [Project Setup](./project-setup.md)).

An additional boundary must be enforced:
- Feature Garden code (`features`, `shared-features`, `libs`) must not import from the legacy codebase.
- Legacy code is allowed to import from Feature Garden.

This forces reusable logic to flow into Feature Garden, not the other way around.

## When to Migrate a Module

Do not migrate proactively. Migrate only when:
- A legacy feature requires a major update — reimplement it inside `features/`.
- A piece of logic is needed by new Feature Garden code — extract it into the appropriate library.

Avoid rewriting features just for the sake of migration.

## Migration Strategy by Module Type

### Reusable logic / domain rules

Move into the appropriate library (typically `libs/domain` or another existing library).

If no library fits, see [Libraries](./libraries.md) before creating a new one.

## Steps for Migrating a Module

1. Identify the module's responsibility — is it domain logic, data access, UI, or feature composition?
2. Decide the target location using [Module Placement](./module-placement.md).
3. Move the module into the target location, following Feature Garden rules.
4. Update legacy callers to import from the new location.
5. Delete the legacy module.
6. If the migration introduces a new library, document it in `libraries-project.md`.

## Avoid

- Mixing migration with new functionality in the same commit.
- Importing legacy code from Feature Garden modules (must stay one-way).
- Migrating modules that don't need updates — they can stay in legacy until a real reason appears.
