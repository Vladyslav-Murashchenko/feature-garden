# Migration

Migration means changing module locations, names, and imports so existing modules fit Feature Garden. Do not change implementation or behavior during migration.

The goal is to project existing modules into Feature Garden so future work can follow the rules in [SKILL.md](../SKILL.md).

Migration has two phases:

1. Planning.
2. Actual migration.

Always start with planning. Do not start actual migration until the user explicitly approves the plan.

## Planning Phase

Create the smallest migration plan that makes the affected modules fit Feature Garden rules.

1. Inspect the requested module or workflow and its imports.
2. Identify the minimal set of modules that must move together to satisfy Feature Garden dependency rules.
3. Strictly apply [Module Placement](./module-placement.md) to choose the destination for each module.
4. Check whether any destination requires a new library. If so, include the suggested library in the plan.
5. Run the Mandatory Plan Gate below. If any check fails, revise the plan and run the gate again.
6. Present the plan to the user and wait for explicit permission before migrating.

### Mandatory Plan Gate

Do not present a migration plan until all checks pass:

- The plan fits [Feature Garden rules](../SKILL.md#rules-of-feature-garden).
- The plan strictly follows [Module Placement](./module-placement.md).
- Every proposed moved module has a placement reason.
- Every required import update is accounted for.
- Any required new library is explicitly listed, or the plan says no new libraries are needed.

### The plan must include:

- Current module path for each moved module.
- Future module path for each moved module.
- A short `Mandatory Plan Gate` result confirming the checks passed, or explaining what was revised before presentation.

Prefer a table for module moves:

| Current path | Future path        | Reason                |
| ------------ | ------------------ | --------------------- |
| `src/...`    | `src/features/...` | Fits feature boundary |

## Actual Migration Phase

Start this phase only after the user explicitly approves the plan.

1. Create approved new libraries, if needed. Follow [Libraries](./libraries.md) for library creation, `feature-garden.config.yaml`, and ESLint updates.
2. Move files to their approved Feature Garden locations.
3. Rename modules only when the approved plan requires it.
4. Update imports to point to the new public or private paths.
5. Remove obsolete files left behind by the move.
6. Run ESLint and fix any Feature Garden rule violations.

Keep implementation unchanged. If behavior changes are needed, stop and ask the user to approve them as a separate task.

## Avoid

- Starting actual migration before the user approves the plan.
- Mixing migration with new functionality or refactoring implementation.
- Migrating more modules than needed to satisfy Feature Garden rules.
- Importing legacy app code from Feature Garden modules.
- Creating shared features when a library or local feature module is enough.
