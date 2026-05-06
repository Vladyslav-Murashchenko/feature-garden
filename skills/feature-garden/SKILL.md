---
name: feature-garden
description: >
  Official Feature Garden architecture skill for applying to frontend projects.
  Use when the task involves organizing project structure, creating features,
  placing modules, setting up libraries, or enforcing architectural boundaries.
---

# Feature Garden Architecture Skill

> **Source:** [Feature Garden](https://github.com/Vladyslav-Murashchenko/feature-garden)

## Layers

- `libs` — low-level reusable building blocks.
- `features` — cohesive modules that form tree-like structures. Private by default, public via `index.ts`.
- `app` — composes features into the final application. Not a strict folder name — use whatever routing/composition folder the framework provides.

`shared-features` is part of the features layer. It contains features that can be reused across other features. Use sparingly — prefer libraries for reuse.

Dependency direction:

    app → features → libs
          features → shared-features → libs

## Import Rules Inside Features

1. **No parent imports** — modules inside a feature must not import from `../**`.
2. **No deep nested imports** — modules must not import from `./*/**`; only through nested feature's `index.ts`.

These two rules create symmetric encapsulation and enable the tree structure.

## Folder Layout

    src/
    ├── <framework-folder>/ # Whatever the framework uses for routing & composition
    ├── features/           # Root features (used only by app layer)
    ├── shared-features/    # Cross-feature reuse (used by any feature)
    └── libs/               # Project-specific libraries

## References

Read the relevant reference when the task matches:

- [Module Placement](./references/module-placement.md) — deciding where a new module should live (feature vs library vs shared-feature). Decision flow, heuristics, when to accept duplication.
- [Nested Features](./references/nested-features.md) — when and how to decompose a feature into nested features.
- [Shared Features](./references/shared-features.md) — when cross-feature reuse is justified.
- [Libraries](./references/libraries.md) — when to create a library, structuring with vertical slices, inter-library dependencies, adding a new library to the project.
- [Enforcement (ESLint)](./references/enforcement-eslint.md) — setting up boundary rules, alias, no-cycle, boundaries plugin. Also: adding a new library to enforcement config, hiding private internals inside a library, hiding external dependencies behind a library.
- [Project Setup](./references/project-setup.md) — setup a Feature Garden on the project.
- [Migration](./references/migration.md) — adopting Feature Garden in an existing/legacy codebase.
