# Feature Garden Front-End Architecture

Feature Garden is an opinionated, tree-based, modular architecture for structuring front-end applications around local reasoning.

- [What problem does this solve?](#what-problem-does-this-solve)
- [What is Feature Garden?](#what-is-feature-garden)
- [Why use Feature Garden?](#why-use-feature-garden)
- [What is the difference with FSD?](#what-is-the-difference-with-fsd)
- [Relationship with other architectural approaches](#relationship-with-other-architectural-approaches)
- [Core principles](#core-principles)
- [Reference implementation](#reference-implementation)
- [Why “Garden”?](#why-garden)
- [Read next](#read-next)
  - [Feature Garden Core](./docs/core.md)
  - [Engineering Guide](./docs/engineering-guide.md)
  - [AI Assisted Coding Guide](./docs/ai-assisted-coding-guide.md)
- [License](#license)

## What problem does this solve?

One of the main problems in modern application development is controlling structural complexity as applications grow.

Structural complexity is the number and direction of relationships between modules, and the difficulty of predicting those relationships from the project structure.

Even without cycles, there are 29,281 possible dependency graphs among just 5 modules. So, to understand how modules are related, we often have to dive into details. For 5 modules, this is manageable. But as the number of modules grows, it becomes much harder to keep the whole structure in mind. For engineers, this slows down development by increasing the mental effort required to understand and safely change the codebase. For AI agents, unclear dependency relationships take up context that could otherwise be used to solve the actual task.

Structural complexity also makes it easier for other forms of complexity and coupling to creep into the codebase.

Existing approaches often optimize either for early development speed or for scalability, but struggle to provide a clear growth path from zero to complexity.
Large-scale solutions such as monorepos or microfrontends can address the problem at the system level, but it often remains within individual repositories or microfrontends. A feature-based approach is a good starting point, but it does not enforce architectural boundaries and leaves many important questions unanswered.

## What is Feature Garden?

Feature Garden is an opinionated, modular architecture inspired by feature-based design, components, and nature.

Its main goal is to enable local reasoning, allowing both humans and AI agents to make safe changes with limited context. Feature Garden achieves this by recursively decomposing features inward and strictly isolating parent features from their child features. As a result, the folder structure clearly reflects high-level dependency relationships between modules.

## Why use Feature Garden?

Feature Garden helps control structural complexity while keeping the architecture simple and pragmatic.

It does not require a large codebase to be useful. It starts paying off as soon as a feature grows beyond a few modules, and module relationships become harder to keep in your head.

The main benefits are:

- **Modularity** — isolated features, low coupling, and local reasoning
- **Predictability** — infer allowed dependencies from the folder structure without reading imports
- **Natural scalability** — features can grow without becoming large flat folders
- **Encapsulation** — internals remain private and are exposed only through explicit public APIs
- **Executable architecture** — rules are encoded in tooling to guide developers and AI coding agents alike

## What is the difference with FSD?

[Feature-Sliced Design (FSD)](https://fsd.how/) is a popular architectural methodology for structuring front-end applications.

Feature Garden addresses a similar challenge, but emphasizes different trade-offs to prioritize managing structural complexity.

The main distinction is that FSD breaks applications down into layers, slices, and segments. Feature Garden primarily relies on tree-based modular decomposition. This approach enables more localized and granular management of complexity.

## Relationship with other architectural approaches

Feature Garden follows the philosophy of doing one thing and doing it well. It focuses primarily on an application’s structural complexity, while leaving other types of complexity to complementary architectural approaches.

Feature Garden does not replace Clean Architecture, Ports & Adapters, or DDD. Instead, it complements them well. Read more about combining Feature Garden with these approaches in the [Engineering Guide](./docs/engineering-guide.md#how-to-combine-feature-garden-with-other-architectural-approaches).

## Core principles

Module dependencies must form a directed acyclic graph (no circular dependencies).

The app has three layers:

- **libs** — collections of modules organized around clear concerns. Provide reusability.
- **features** — modules represented as folders that contain other modules. Features form tree-like structures. Helps control complexity.
- **app** — composes features into the final application and implements routing according to the chosen framework.

Read more about [Feature Garden Core](./docs/core.md) principles.

## Reference implementation

A full working example built using Feature Garden is available here:

https://github.com/Vladyslav-Murashchenko/productivity-up

The project demonstrates:
- Layer separation (**libs**, **features**, **app**)
- Strict import boundaries enforced with ESLint
- Nested feature composition
- Practical usage of shared features

It is a small but complete application that can serve as a reference implementation.

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
Feature Garden follows the same principle: nested features are independent of their parents and can be extracted to reuse elsewhere.
This is only possible when dependency rules are strictly enforced.

## Read next

- [Feature Garden Core](./docs/core.md) — understand the fundamental ideas behind the architecture.
- [Engineering Guide](./docs/engineering-guide.md) — learn how to apply Feature Garden in real projects.
- [AI Assisted Coding Guide](./docs/ai-assisted-coding-guide.md) — use AI as a force multiplier without losing control over structure.

## License

© 2026-present [Vladyslav Murashchenko](https://www.linkedin.com/in/vladyslav-murashchenko-3346b917a/)

Feature Garden is licensed under the Creative Commons Attribution 4.0 International License (CC BY 4.0).

You are free to use, modify, and distribute this work, including commercially. Just make sure to give credit to the original author.

See the [LICENSE](./LICENSE) file for full details.
