---
name: feature-garden
description: >
  Official Feature Garden architecture skill for applying to frontend projects. Use when the task involves organizing project structure.
---

# Feature Garden Architecture Skill

> **Source** [Feature Garden](https://github.com/Vladyslav-Murashchenko/feature-garden)

## Core Mental Model

Feature Garden has three main layers:

- `libs` — low-level reusable building blocks.
- `features` — cohesive architectural modules that form tree-like structures.
- `app` — framework-specific composition layer.

The dependency direction is:

```txt
app -> features -> libs
```
