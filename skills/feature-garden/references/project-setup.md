# Project Setup

Apply Feature Garden to a new or existing project.

## Steps

### 1. Create top-level folders

The framework's routing folder becomes the **app layer** — no need to rename it.

Inside `src/` (or the framework's source root):

```
src/
├── features/
├── shared-features/
└── libs/
```

If any folder already exist, rename existing one to {current-name}-old.

Add `.gitkeep` files so Git tracks empty folders.

### 2. Decide initial libraries

Ask the user about initial libraries, their responsibilities, and dependencies between them.

Most projects start with three libraries: `domain`, `api`, `ui`. List them as recommended.

For each chosen library, create a folder under `libs/`. Also `.gitkeep`.

### 3. Create feature-garden.config.yaml

Create `feature-garden.config.yaml` in the project root with the chosen libraries and settings.

Example if recommended libraries are accepted:

```yaml
nestedFeatureThreshold: 5

libraries:
  domain:
    intent: Pure domain models and logic. Platform independent. No infrastructure dependencies.
    depends-on: []
    examples: [model types, validation functions, domain calculations, business rules]

  api:
    intent: Data access layer. Encapsulates fetching, caching, mutations, and server state management.
    depends-on: [domain]
    examples: [query options, mutation options, API client configuration]

  ui:
    intent: Reusable UI primitives. No domain knowledge.
    depends-on: []
    examples: [Button, Modal, Input, TextField, Card, Spinner, layout utilities]
```

### 4. Set up boundary enforcement

Configure ESLint rules. See [Enforcement (ESLint)](./enforcement-eslint.md).

Enforcement covers:
- No cycles in the dependency graph
- Layer dependency directions
- Inter-library dependencies
- Import restrictions inside features

Note that for recommended libraries, the only dependency is that api can use domain.

### 5. Reference Feature Garden in README

Add a link to the architecture in the project's `README.md`:

```
This project follows the Feature Garden architecture:
https://github.com/Vladyslav-Murashchenko/feature-garden
```
