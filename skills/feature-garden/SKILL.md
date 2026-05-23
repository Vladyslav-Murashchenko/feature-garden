---
name: feature-garden
description: >
  Feature Garden architecture for frontend projects. Use when: organizing folder structure,
  deciding where a module should live, creating or nesting features, extracting shared features,
  creating or structuring libraries, setting up ESLint boundary enforcement (no-cycle, boundaries plugin,
  no-restricted-imports), initializing a new project with Feature Garden, migrating legacy modules, helping AI agents work with limited context using Feature Garden boundaries.
  Covers: layers (libs/features/app), import rules, code reuse strategy, AI context selection.
---

# Feature Garden Architecture Skill

> **Source:** [Feature Garden](https://github.com/Vladyslav-Murashchenko/feature-garden)

## Layers

- `libs` — collections of reusable building blocks.
- `features` — cohesive modules that form tree-like structures. Private by default, public via `index.ts`.
- `app` — composes features into the final application. Not a strict folder name — use whatever routing/composition folder the framework provides.

`shared-features` is part of the features layer. It contains features that can be reused across other features. Use sparingly — prefer libraries for reuse.

Dependency direction:

    app → features → libs
          features → shared-features → libs

## Import Rules Inside Features

1. **No parent imports** — modules inside a feature must not import from `..**`.
2. **No deep nested imports** — modules must not import from `./*/**`; only through nested feature's `index.ts`.

These two rules create symmetric isolation and enable the tree structure.

## Folder Layout

    src/
    ├── <framework-folder>/ # Whatever the framework uses for routing & composition
    ├── features/           # Root features (used only by app layer)
    ├── shared-features/    # Cross-feature reuse (used by any feature)
    └── libs/               # Project-specific libraries

## Boundary-aware Context Selection

Use Feature Garden boundaries to choose the smallest useful context.

First classify the target file's current boundary: app/legacy code, root feature, nested feature, shared feature, or library.

If the target is inside a feature, start with that feature folder and read the files directly relevant to the task. Treat nested features and libraries as external boundaries unless the task explicitly targets them.

If the target is app/legacy code, start with the local route/composition area and the public APIs it consumes. For migration work, inspect both the current legacy module and the intended Feature Garden destination before deciding what context to expand.

If the target is a library, start with that library's public API, implementation files relevant to the task, and its rules in `feature-garden.config.yaml`. Read consuming features only when usage context is needed to preserve behavior.

If the target is a shared feature, treat it like a feature that may have multiple consumers. Start with the shared feature's public API and relevant internals, then inspect consumers only when changing its contract.

Do not expand context mechanically through imports. Read child internals only when modifying that child feature. Read parent code only when composition context is needed. Read libraries only when their public API, implementation, or rules are involved.

Prefer changes that stay within one boundary. Expand context incrementally, only when the current boundary is not enough to complete the task.

## References

Read the relevant reference when the task matches:

- [Module Placement](./references/module-placement.md) — deciding where a new module should live: 3-step decision flow (reusable? single concern? SRP-safe?), libraries vs shared features, no segmentation by type inside a feature, key heuristics for quick decisions.
- [Nested Features](./references/nested-features.md) — when to extract (>`nestedFeatureThreshold` modules), how to extract, how to count modules (nested features don't count), naming heuristic, avoiding premature extraction, full example.
- [Libraries](./references/libraries.md) — code reuse is a purpose of libraries, when to create a new one (check existing first, avoid generic `utils`/`helpers`), vertical slicing, inter-library dependencies, link to project-specific library list.
- [Enforcement (ESLint)](./references/enforcement-eslint.md) — `@` path alias, `import/no-cycle`, `eslint-plugin-boundaries` config for layers, `no-restricted-imports` for feature isolation, optional `_internal/` scopes, hiding external dependencies behind libraries, checklist for adding a new library.
- [Project Setup](./references/project-setup.md) — 5-step setup: create folders, choose initial libraries, create `feature-garden.config.yaml`, set up enforcement, link Feature Garden in README.
- [Migration](./references/migration.md) — per-module migration strategy for legacy codebases: one-way boundary rule, when to migrate (only on real need), strategy by module type (logic/API/UI/whole feature), step-by-step migration flow.
