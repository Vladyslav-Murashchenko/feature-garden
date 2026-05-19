# AI-Assisted Coding Guide

This guide contains recommendations for using Feature Garden with AI, along with ready-to-use prompts designed to work with Feature Garden skills.

I recommend reading [Feature Garden Core](./core.md) and [Engineering Guide](./engineering-guide.md) before this guide.

**Guide**

- [Why Feature Garden works well with AI?](#why-feature-garden-works-well-with-ai)
- [How to achieve better results?](#how-to-achieve-better-results)

**Skill management**

- [How to install Feature Garden skills?](#how-to-install-feature-garden-skills)
- [How to update Feature Garden skills?](#how-to-update-feature-garden-skills)

**Ready-to-use prompts**

- [Set up the project](#set-up-the-project)

## Why Feature Garden works well with AI?

Feature Garden structures code in a way that makes it easier to navigate, understand, and reason about with limited context. This matches how AI coding systems work:

- A tree structure reduces the amount of context AI needs to understand a change
- Strict import rules reduce ambiguity and prevent accidental coupling
- Local reasoning is an explicit architectural goal
- Progressive structure gives AI a predictable way to scale features over time
- ESLint-enforced boundaries create fast feedback loops for AI-generated changes
- Explicit shared-feature trade-offs and strict structure make AI changes easier to review

## How to achieve better results?

To get the best results, keep AI tasks focused and boundary-aware:

- Ask AI to work within one feature subtree at a time
- Do not mix implementing new functionality with extracting nested features
- Pay extra attention to the shared features AI extracts
- Run ESLint after AI changes and let AI fix boundary violations

## How to install Feature Garden skills?

To install Feature Garden skills, run:

```bash
npx skills add Vladyslav-Murashchenko/feature-garden --skill feature-garden
```

After installation, [set up the project](#set-up-the-project).

## How to update Feature Garden skills?

When a new version is merged into this repository, update your skills by running:

```bash
npx skills update feature-garden
```

## Set up the project

The prompt for new and existing projects is the same:

```text
Set up Feature Garden for this project
```


