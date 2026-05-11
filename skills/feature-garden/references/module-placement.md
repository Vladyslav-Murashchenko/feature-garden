# Module Placement

## Decision Flow

When deciding where a module should live, follow this sequence:

1. **Should this module be reusable across features?**
   - No → keep it within the current feature.
   - Yes → continue to step 2.

2. **Does it represent a single, well-defined concern?**
   - Yes → put it into a dedicated library. Check existing libraries in `feature-garden.config.yaml` first. Suggest creating a new library only when none of the existing libraries fit.
   - No → continue to step 3.

3. **Are you sure this reuse does not violate SRP?**
   - No → do not reuse. Keep it in the feature and accept duplication.
   - Yes → reuse via a shared feature.

## Libraries vs Shared Features

Libraries are the primary reuse mechanism. They encapsulate a single concern (e.g., domain logic, data access, UI primitives).

Shared features are for code that already depends on multiple libraries (e.g., a composition of UI + API). They are a deliberate trade-off — use only when you are confident the module has a single reason to change.

Overusing shared features leads to complex and fragile dependency structures.

## Within a Feature

Keep all modules directly in the feature folder — no additional segmentation by type (no `hooks/`, `components/`, `utils/` subfolders).

## Reuse Within a Single Feature

If reuse happens only within the scope of one feature (e.g., two sibling modules importing the same helper), a shared feature is not needed. Just keep the shared module in the common parent feature.

## Key Heuristics For Reuse

- If it's domain logic with no infra dependencies → likely belongs in a domain library
- If it's data access or caching → likely belongs in an API library
- If it's a UI primitive with no domain knowledge → likely belongs in a UI library
- If it composes multiple libraries into a reusable unit → candidate for shared feature
- If unsure whether duplication is coincidental or real knowledge → keep duplicated and revisit later
