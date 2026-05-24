---
name: feature-garden
description: >
  Feature Garden architecture for frontend projects. Use when: organizing folder structure,
  deciding where a module should live, creating or nesting features, extracting shared features,
  creating or structuring libraries, setting up ESLint boundary enforcement (no-cycle, boundaries plugin,
  no-restricted-imports), initializing a new project with Feature Garden, implementing new frontend functionality,
  migrating legacy modules, helping AI agents work with limited context using Feature Garden boundaries.
  Covers: layers (libs/features/app), import rules, code reuse strategy, AI context selection.
---

# Feature Garden Architecture Skill

> **Source:** [Feature Garden](https://github.com/Vladyslav-Murashchenko/feature-garden)

## Layers

- `libs` — collections of reusable building blocks.
- `features` — cohesive modules that form tree-like structures. Private by default, public via `index.ts`.
- `app` — composes features into the final application. Not a strict folder name — use whatever routing/composition folder the framework provides.

The `features` layer contains two kinds of features:

- `regular features` — product features composed by the app layer.
- `shared features` — reusable features used by regular features. Use sparingly — prefer libraries for code reuse.

## Rules of Feature Garden

Agents must treat these rules as strict architecture constraints, not style preferences:

Module dependencies must form a directed acyclic graph.

Allowed dependencies:

- `app -> regular features`
- `regular features -> shared features`
- `regular features -> libs`
- `shared features -> libs`

Disallowed dependencies:

- `libs -> features`
- `libs -> app`
- `shared features -> regular features`
- `shared features -> app`
- `regular features -> app`

Additional rules:

- Dependencies between libraries must be explicit and follow rules enforced by project ESLint config.
- Library modules must fit requirements in `feature-garden.config.yaml`.
- Folders at any depth inside the features layer are features. Technical folders such as `ui/`, `models/`, `utils/`, and `api/` are not allowed.
- Modules inside a feature cannot import from the parent feature: `..**` is restricted.
- Modules inside a feature cannot import private modules from nested features: `./*/**` is restricted.
- All rules must be enforced by tooling (ESLint or equivalent). If a rule is not enforced, notify the user. Inspect and preserve the active tooling configuration before editing architecture-sensitive code.

## Folder Structure

src/
├── features/ # regular features
├── shared-features/ # shared features
├── libs/ # libs layer
└── ... # app layer

## Requested Change Boundary Classification

Before choosing context or editing files, classify the boundary touched by the requested change:

1. Get the full file path for each affected file.
2. Match the path against the Folder Structure section above to get the layer.
3. Treat paths matched by `... # app layer` as app/legacy code.

If an affected file is classified as `app` and the change implements behavior, treat it as legacy code. Behavior includes user-facing behavior, state, UI controls, workflows, domain logic, or reusable code. A folder that looks feature-like inside an app boundary is still legacy unless its full path places it inside the features layer.

## Boundary-aware Context Selection

Use Feature Garden boundaries to choose the smallest useful context.

First classify the boundary touched by the requested change using Requested Change Boundary Classification: app/legacy code, root feature, nested feature, shared feature, or library.

If the target is inside a feature, start with that feature folder and read the files directly relevant to the task. Treat nested features and libraries as external boundaries unless the task explicitly targets them.

If the target is app/legacy code, start with the local route/composition area and the public APIs it consumes. For migration work, inspect both the current legacy module and the intended Feature Garden destination before deciding what context to expand.

If the target is a library, start with that library's public API, implementation files relevant to the task, and its rules in `feature-garden.config.yaml`. Read consuming features only when usage context is needed to preserve behavior.

If the target is a shared feature, treat it like a feature that may have multiple consumers. Start with the shared feature's public API and relevant internals, then inspect consumers only when changing its contract.

Do not expand context mechanically through imports. Read child internals only when modifying that child feature. Read parent code only when composition context is needed. Read libraries only when their public API, implementation, or rules are involved.

Prefer changes that stay within one boundary. Expand context incrementally, only when the current boundary is not enough to complete the task.

## Legacy Code Policy

Treat this as a mandatory gate before editing legacy code:

1. Stop before editing legacy files.
2. Tell the user the Legacy Code Policy was triggered.
3. Recommend the Feature Garden destination for the new functionality.
4. Continue only after the user explicitly chooses one of these paths:
   - implement the functionality inside Feature Garden.
   - make the legacy edit anyway.

If the user chooses to implement the functionality inside Feature Garden, inspect the smallest relevant legacy surface and present a detailed per-module migration plan for the requested feature. Do not implement or migrate anything until the user explicitly approves that plan.

## References

Read the relevant reference when the task matches:

- [Module Placement](./references/module-placement.md) — deciding where a new module should live: 3-step decision flow (reusable? single concern? SRP-safe?), libraries vs shared features, no segmentation by type inside a feature, key heuristics for quick decisions.
- [Nested Features](./references/nested-features.md) — when to extract (>`nestedFeatureThreshold` modules), how to extract, how to count modules (nested features don't count), naming heuristic, avoiding premature extraction, full example.
- [Libraries](./references/libraries.md) — purpose of libraries, how to create a new one, vertical slicing, hiding detail behind libraries (external libraries, private modules), link to project-specific library list.
- [Enforcement (ESLint)](./references/enforcement-eslint.md) — `@` path alias, `import/no-cycle`, `eslint-plugin-boundaries` config for layers, `no-restricted-imports` for feature isolation, optional `_internal/` scopes, hiding external dependencies behind libraries, checklist for adding a new library.
- [Project Setup](./references/project-setup.md) — 5-step setup: create folders, choose initial libraries, create `feature-garden.config.yaml`, set up enforcement, link Feature Garden in README.
- [Migration](./references/migration.md) — per-module migration strategy for legacy codebases: one-way boundary rule, migration flow, and incremental large-feature migration.
