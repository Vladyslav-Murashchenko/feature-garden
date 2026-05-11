# Nested Features

## When to Create

Consider extracting a nested feature when a feature has more than `nestedFeatureThreshold` (from `feature-garden.config.yaml`) modules.

Do not mix new functionality with nested feature extraction. Suggest refactoring as next step after adding new functionality.

## How to Extract

1. Look for a group of modules that can be hidden inside a folder and exposed through a small public API.
2. Ideally, a nested feature exposes only one module via `index.ts`.
3. A nested feature should contain at least 2 modules.
4. After extraction, the parent feature should have 2–`nestedFeatureThreshold` modules remaining.

## Counting Modules

Treat all technical files that belong to the same module as one module:

```
Tasks.tsx
Tasks.test.tsx
Tasks.module.css
```

This counts as 1 module.

Nested features (folders with `index.ts`) are not counted as modules — they are already extracted.

## Naming

Clear intent is more important than the exact number of extracted modules. If the nested feature can have an obvious, concise, and clear name — it probably has a clear responsibility.

## Avoid Premature Extraction

Do not create nested features too early. As the feature grows, a better extraction point may emerge.

If a potential nested feature would contain only 1 module — it's not worth extracting yet.

## Example

```
features/
└── tasks/
    ├── index.ts         # exports Tasks
    ├── Filters.tsx
    ├── TaskList.tsx     # imports Task
    ├── Tasks.tsx        # imports CreateTask, ActiveTask
    ├── Tasks.test.tsx
    ├── useTemporaryHiddenTaskId.ts
    ├── active-task/
    │   ├── index.ts     # exports ActiveTask
    │   ├── ActiveTask.tsx
    │   ├── ActiveTask.test.tsx
    │   ├── TaskName.tsx
    │   └── Timer.tsx
    ├── create-task/
    │   ├── index.ts     # exports CreateTask
    │   ├── CreateTask.tsx
    │   ├── CreateTask.test.tsx
    │   └── useAutoFocusOnDesktop.ts
    └── task/
        ├── index.ts     # exports Task
        ├── DeleteTask.tsx
        ├── Task.tsx
        ├── Task.test.tsx
        ├── TaskDuration.tsx
        ├── TaskName.tsx
        └── time-intervals/
            ├── index.ts
            └── ...
```

The parent `tasks/` has 4 modules at its level (`Filters`, `TaskList`, `Tasks`, `useTemporaryHiddenTaskId`). Three groups were extracted as nested features: `active-task`, `create-task`, `task` — each with a clear name and responsibility.
