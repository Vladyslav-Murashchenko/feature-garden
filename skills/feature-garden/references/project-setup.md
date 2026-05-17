# Project Setup

> **Idempotency:** Skip any step whose outcome already exists in the project.

Apply Feature Garden to a new or existing project.

## Step 1 — Create Top-Level Folders

The framework's routing/composition folder becomes the **app layer** — do NOT rename it.

Create the following folders inside `src/` (or the framework's source root):

```
src/
├── features/
├── shared-features/
└── libs/
```

- **IF** any of these folders already exist with non-Feature-Garden content → rename the existing folder to `{name}-old`.
- Add `.gitkeep` to each empty folder so Git tracks them.

## Step 2 — Decide Initial Libraries

> **ASK the user** which libraries they want, their responsibilities, and dependencies between them.

Recommend starting with: `domain`, `api`, `ui`.

For each chosen library, create `src/libs/<name>/` with a `.gitkeep` file.

## Step 3 — Create feature-garden.config.yaml

Create `feature-garden.config.yaml` in the project root.

Required fields:
- `nestedFeatureThreshold` — module count that triggers nested feature extraction (default: `5`).
- `libraries` — map of library names, each with `intent` and `rules` (`can` / `cannot` lists).

Example (if recommended libraries are accepted):

```yaml
nestedFeatureThreshold: 5

libraries:
  domain:
    intent: Platform-independent business models and logic.
    rules:
      can:
        - Define domain types, entities, value objects, and pure business rules
        - Implement validation and calculations that do not require IO
        - Expose pure functions for domain behavior
      cannot:
        - Import UI, API, framework, routing, storage, or infrastructure code
        - Perform IO: HTTP requests, localStorage, cookies, timers, random values, or logging
        - Depend on React, browser APIs, server APIs, or external services

  api:
    intent: Data access and server-state boundary.
    rules:
      can:
        - Fetch, cache, mutate, and synchronize remote data
        - Map external API DTOs to application/domain-friendly models
        - Encapsulate server state management libraries
      cannot:
        - Contain reusable UI components
        - Contain core business rules that should live in domain
        - Expose raw external API details if they leak into features unnecessarily

  ui:
    intent: Reusable UI primitives without application-specific knowledge.
    rules:
      can:
        - Define reusable visual components, layout primitives, and design-system helpers
        - Handle presentation-only state such as open, selected, expanded, or focused
        - Accept data and callbacks through props
      cannot:
        - Import domain, api, or feature modules
        - Know business concepts, user flows, permissions, or server data shape
        - Perform data fetching, mutations, routing decisions, or persistence
```

## Step 4 — Set Up Boundary Enforcement

Configure ESLint rules per [Enforcement (ESLint)](./enforcement-eslint.md).

## Step 5 — Reference Feature Garden in README

Add to the project's `README.md`:

```
This project follows the Feature Garden architecture:
https://github.com/Vladyslav-Murashchenko/feature-garden
```
