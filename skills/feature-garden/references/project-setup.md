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

Ask the user about initial libraries they want to use, and dependencies between them.

Most projects start with three libraries: `domain`, `api`, `ui`. List them as recommended.

For each chosen library, create a folder under `libs/`.

### 3. Set up boundary enforcement

Configure ESLint rules. See [Enforcement (ESLint)](./enforcement-eslint.md).

Enforcement covers:
- No cycles in the dependency graph
- Layer dependency directions
- Inter-library dependencies
- Import restrictions inside features

Note that for recommended libraries, the only dependency is that api can use domain.

### 4. Document project-specific libraries

Create `references/libraries-project.md` listing each library.

Example if recommended are accepted.
```markdown
# Project Libraries

## libs/domain

**Intent:** Pure domain models and logic. Platform independent. No infrastructure dependencies.

**Depends on:** nothing

**Example modules:** model types, validation functions, domain calculations, business rules

## libs/api

**Intent:** Data access layer. Encapsulates fetching, caching, mutations, and server state management.

**Depends on:** domain

**Example modules:** query options, mutation options, API client configuration

## libs/ui

**Intent:** Reusable UI primitives. No domain knowledge.

**Depends on:** nothing

**Example modules:** Button, Modal, Input, TextField, Card, Spinner, layout utilities
```

This file is the source of truth for the AI agent and new team members about what each library is for.

Update it whenever a library is added or its responsibility changes.

### 5. Reference Feature Garden in README

Add a link to the architecture in the project's `README.md`:

```
This project follows the Feature Garden architecture:
https://github.com/Vladyslav-Murashchenko/feature-garden
```
