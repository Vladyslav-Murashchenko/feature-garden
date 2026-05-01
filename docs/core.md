# Feature Garden Core

Feature Garden is an opinionated, tree-based, modular architecture for front-end applications.

- [Terminology](#terminology)
- [Goal](#goal)
- [Core Idea](#core-idea)
- [Why do features form trees?](#why-do-features-form-trees)
- [Rules](#rules)

## Terminology

- **Architectural module** — an independent structural unit of the system that encapsulates functionality behind a public interface
- **Module** — an architectural module implemented as a single file
- **Feature** — an architectural module implemented as a folder that organizes modules and nested features
- **Library** — a collection of modules grouped around a single responsibility
- **External library** — package installed via a package manager like npm

## Goal

The goal of Feature Garden is to manage the application's structural complexity by controlling module visibility.

## Core Idea
The application consists of three layers:

- Libraries — provide reuse
- Features — define structure
- App — composes the application

### Libraries
Libraries provide low-level building blocks and serve as the primary mechanism for code reuse.
They can also encapsulate implementation details, such as external libraries, and hide them from the rest of the application.

Libraries are typically independent and unaware of each other.
However, dependencies between libraries are allowed.

### Features
Features are the main mechanism for managing structural complexity.
They compose library modules into cohesive architectural modules.
Root-level features typically represent user-facing capabilities.
Modules inside a feature are private by default and become public only through the feature’s public entry point (`index.ts`).
Features can be nested, forming a tree structure that helps manage complexity.

The features layer consists of two folders: `features` and `shared-features`.
The difference lies in how root-level features are used:

- Root-level features in `features` are used only by the app layer
- Root-level features in `shared-features` can be used by any feature

This enables reuse at the feature level.

Shared features are not the primary mechanism for structuring an application. 
They represent a deliberate trade-off, used only when avoiding duplication (DRY) is more important than preserving strict architectural isolation.

### App
The App layer is responsible for composing features into the final application.
Composition should follow the framework’s conventions and mechanisms.

## Why do features form trees?

Dependencies form a directed graph. In a healthy codebase, this graph should not have cycles. Such a graph is called a directed acyclic graph, or DAG.

A tree is a DAG with an additional constraint: each node can have only one parent.

This constraint also limits complexity. A general DAG with `n` modules can have up to `O(n²)` dependency edges, while a tree has only `O(n)`. This means there are fewer relationships to understand.

Can we make a DAG visible in the project folder structure? Not really. A folder structure is naturally a tree, while a DAG can contain arbitrary acyclic relationships.

Conveniently, UI composition is often tree-shaped: the DOM is a tree, and component-based UI is usually described as a tree of components.

What if we could simplify the dependency DAG into a tree and express it explicitly through the folder structure? This is the core idea of Feature Garden.

To make this work, Feature Garden enforces strict import rules inside a feature:

- Modules inside a feature cannot import from the parent feature: `../**` is restricted.
- Modules inside a feature cannot import private modules from nested features: `./*/**` is restricted.

This enables symmetric encapsulation:

- A nested feature does not know where it is located in the tree.
- A parent feature does not know the internal nesting depth of its child features.

This combination of symmetric encapsulation and an explicit tree structure gives Feature Garden several unique properties:

- Local decomposition — a growing feature can be split inward into nested features without exposing internal complexity to the rest of the application.
- Scoped names — nested feature names describe local responsibility instead of carrying their parent context as a prefix.
- Simple promotion — moving a nested feature to `shared-features`, or somewhere else, requires changing imports in only one place: its immediate parent.
- Nesting is cheap — depth does not add structural coupling, so nested features avoid the common problems of deep nesting.

Unlike layer-based approaches such as FSD, where isolation applies primarily between
slices of the same layer, these properties hold recursively at every nesting level.

These advantages are powerful, but trees are not universal enough to represent the full dependency graph of a real application.
Feature Garden’s trade-off is to use trees whenever possible, but to fall back on libraries and shared features when reuse requires a more general DAG.

## Rules
- Module dependencies must form a directed acyclic graph (no circular dependencies)
- Layers must follow the dependency rules shown below
```mermaid
graph LR
    libs["libs"]
    features["features"]
    app["app"]

    features --> libs
    app --> features
```
- Dependencies between libraries must be explicit
- Modules inside a feature cannot import from the parent feature: `../**` is restricted.
- Modules inside a feature cannot import private modules from nested features: `./*/**` is restricted.
- All rules must be enforced by tooling (ESLint or equivalent)
