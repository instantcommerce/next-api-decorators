---
title: Getting Started
slug: /
---

## Motivation

Building serverless functions declaratively with classes and decorators makes dealing with Next.js API routes easier and brings order and sanity to your `/pages/api` codebase.

The structure is heavily inspired by NestJS, which is an amazing framework for a lot of use cases. On the other hand, a separate NestJS repo for your backend can also bring unneeded overhead and complexity to projects with a smaller set of backend requirements. Combining the structure of NestJS, with the ease of use of Next.js, brings the best of both worlds for the right use case.

## Installation

```bash npm2yarn
npm install @storyofams/next-api-decorators
```

Since decorators are still in proposal state, you need to add the following plugins to your `devDependencies` in order to use them:

```bash npm2yarn
npm install --save-dev @babel/core babel-plugin-transform-typescript-metadata @babel/plugin-proposal-decorators babel-plugin-parameter-decorator
```

Make sure to add the following lines to the start of the `plugins` section in your babel configuration file:

```json5
{
  "plugins": [
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "babel-plugin-parameter-decorator",
    // ... other plugins
  ]
}
```

Your tsconfig.json needs the following flag in the `compilerOptions` section:

```json5
"experimentalDecorators": true
```

## Example

Please see [the example](https://github.com/storyofams/next-api-decorators/tree/master/example) to see how this library can be used.
