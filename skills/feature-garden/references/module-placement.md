# Module Placement

## Decision Flow

When deciding where a module should live, follow this sequence:

Before deciding, read `feature-garden.config.yaml` and [Libraries](./libraries.md) to understand the existing libraries and their responsibilities.

1. **Does it represent a well-defined concern that already has a matching library?**
   - Yes → put it into that library.
   - No → continue to step 2.

2. **Should this module be reusable across features?**
   - No → keep it within the current feature.
   - Yes → continue to step 3.

3. **Does it represent a single, well-defined concern?**
   - Yes → suggest [creating a new library](./libraries.md#adding-a-new-library) to the user.
   - No → continue to step 4.

4. **Are you sure this reuse does not violate SRP?**
   - No → do not reuse. Keep it in the feature and accept duplication.
   - Yes → reuse via a shared feature.

## Libraries vs Shared Features

Libraries are the primary reuse mechanism. They encapsulate a single concern (e.g., domain logic, data access, UI primitives).

Shared features are for code that already depends on multiple libraries (e.g., a UI + API composition). They are a deliberate trade-off — use only when you are confident the module has a single reason to change.

Overusing shared features leads to complex and fragile dependency structures.

## Reuse Within a Single Feature

If reuse happens only inside one parent feature, do not create a shared feature.

Keep the code inside that parent feature:
- as a plain module, for implementation reuse
- as a nested feature, for a cohesive feature-level capability

## Key Heuristics For Reuse

- If it's domain logic with no infra dependencies → likely belongs in a domain library
- If it's data access or caching → likely belongs in an API library
- If it's a UI primitive with no domain knowledge → likely belongs in a UI library
- If it composes multiple libraries into a reusable unit → candidate for shared feature
- If unsure whether duplication is coincidental or real knowledge → keep duplicated and revisit later
