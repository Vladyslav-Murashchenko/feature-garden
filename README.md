# Feature Garden Front-End Architecture

Feature Garden is an opinionated, tree-based, modular architecture for front-end applications.

- [What problem does this solve?](#what-problem-does-this-solve)
- [What is Feature Garden?](#what-is-feature-garden)
- [What is the difference with FSD?](#what-is-the-difference-with-fsd)
- [Core principles](#core-principles)
- [Why “Garden”?](#why-garden)
- [Reference implementation](#reference-implementation)
- [Read next](#read-next)
  - [Feature Garden Core](./docs/core.md)
  - [Engineering Guide](./docs/engineering-guide.md)
  - [Enforcement Guide](./docs/enforcement-guide.md)
  - [AI Assisted Coding Guide](./docs/ai-assisted-coding-guide.md)
- [License](#license)

## What problem does this solve?

One of the main problems in modern application development is controlling structural complexity as applications grow.

Structural complexity is the number and direction of relationships between modules, and the predictability of those relationships from the project structure.

Existing approaches often optimize either for early development speed or for scalability, but struggle to provide a clear growth path from zero to complexity.
Large-scale solutions often sacrifice simplicity (KISS) and pragmatism (YAGNI) in favor of strict rules and structure. A feature-based approach is a good starting point, but it does not enforce architectural boundaries and leaves many important questions unanswered.

## What is Feature Garden?
Feature Garden is an opinionated modular architecture inspired by the feature-based approach, components, and nature.
It is designed to scale naturally from a single feature to a complex system, just like a garden grows from a small tree. Feature Garden is conducive to SoC, low coupling, high cohesion, KISS, DRY, YAGNI, and local reasoning.

## What is the difference with FSD?

[Feature-Sliced Design (FSD)](https://fsd.how/) is a popular architectural methodology for structuring front-end applications.

Feature Garden addresses a similar challenge, but emphasizes different trade-offs to prioritize managing structural complexity.

The main distinction is that FSD breaks applications down into layers, slices, and segments. Feature Garden also uses layers, but it primarily relies on tree-based feature decomposition. This approach enables more localized and granular management of complexity.

## Core principles

Module dependencies must form a directed acyclic graph (no circular dependencies).

The app has three layers:

- **libs** — low-level building blocks of the application. Provide reusability.
- **features** — modules represented as folders that contain other modules. Features form tree-like structures. Helps control complexity.
- **app** — composes features into the final application and implements routing according to the chosen framework.

Read more about Feature Garden core principles [here](./docs/core.md).

## Why “Garden”?

Imagine a world with countless plants.  
They are different, yet share the same chemical compounds.

In the Feature Garden metaphor:

- Chemical compounds are **libs**
- Plants are **features**
- The garden is the **app**

Chemical compounds are reusable across plants.  
Each plant in the garden is unique and self-contained.  
The garden determines which plants exist and how they are arranged.

Most plants grow independently, like trees.  
But there are also vines (**shared-features**) — a special kind of plant that wraps around others.
Vines are useful, but if the garden contains too many of them, it can turn into an impenetrable jungle.

An interesting property of plants is that a branch can be cut off and grown as a separate plant, or grafted onto another one.
Feature Garden follows the same principle: nested features are independent of their parents and can be extracted or reused elsewhere.
This is only possible when dependency rules are strictly enforced.

## Reference implementation

A full working example built using Feature Garden is available here:

https://github.com/Vladyslav-Murashchenko/productivity-up

The project demonstrates:
- Layer separation (**libs**, **features**, **app**)
- Strict import boundaries enforced with ESLint
- Nested feature composition
- Practical usage of shared feature

It is a small but complete application that can serve as a reference implementation.

## Read next

- [Feature Garden Core](./docs/core.md) — understand the fundamental ideas behind the architecture.
- [Engineering Guide](./docs/engineering-guide.md) — learn how to apply Feature Garden in real projects.
- [Enforcement Guide](./docs/enforcement-guide.md) — keep your architecture consistent as the codebase grows.
- [AI Assisted Coding Guide](./docs/ai-assisted-coding-guide.md) — use AI as a force multiplier without losing control over structure.

## License

© 2026-present Vladyslav Murashchenko

Feature Garden is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).

You are free to use, modify, and distribute this work, including commercially. Just make sure to give credit to the original author.

See the LICENSE file for full details.
