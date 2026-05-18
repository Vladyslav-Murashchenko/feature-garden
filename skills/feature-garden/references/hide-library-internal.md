Add a disallow rule to `boundaries/dependencies` for each library that needs private internals:

```js
{
  disallow: {
    to: {
      type: ["lib-ui"], // list libraries that have _internal/ folders
      internalPath: "_internal/**",
    },
  },
}
```
