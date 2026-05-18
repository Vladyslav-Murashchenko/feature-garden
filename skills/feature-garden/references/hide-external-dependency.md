Add two rules to `boundaries/dependencies` — one to disallow globally, one to allow from the owning library:

```js
// 1. Disallow these packages globally
{
  disallow: {
    to: { origin: "external" },
    dependency: { source: ["@heroui/react", "@heroui/styles"] },
  },
},
// 2. Allow them only from the designated library
{
  from: { type: "lib-ui" },
  allow: {
    to: { origin: "external" },
    dependency: { source: ["@heroui/react", "@heroui/styles"] },
  },
}
```

Replace package names and library type with actual values for the project.
