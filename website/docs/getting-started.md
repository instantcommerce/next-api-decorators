---
title: Getting Started
slug: /
---

## Basic usage

```ts
import { createHandler, Get } from '@instantcommerce/next-api-decorators';

class UserHandler {
  @Get()
  public async users() {
    return await DB.findUsers();
  }
}

export default createHandler(UserHandler);
```

:::note
The example above is very simple. You can find more in depth usage [here](introduction/basics).
:::

## Motivation

Building serverless functions declaratively with classes and decorators makes dealing with Next.js API routes easier and brings order and sanity to your `/pages/api` codebase.

The structure is heavily inspired by NestJS, which is an amazing framework for a lot of use cases. On the other hand, a separate NestJS repo for your backend can also bring unneeded overhead and complexity to projects with a smaller set of backend requirements. Combining the structure of NestJS, with the ease of use of Next.js, brings the best of both worlds for the right use case.

If you are not familiar with Next.js or NestJS and want some more information (or need to be convinced), check out the article
[Awesome Next.js API Routes with next-api-decorators](https://www.tpjnorton.com/blog/posts/awesome-next-js-api-routes-with-next-api-decorators) by [@tn12787](https://github.com/tn12787)

## Installation

```bash npm2yarn
npm install @instantcommerce/next-api-decorators
```

### Using with SWC

Your tsconfig.json needs the following flags in the `compilerOptions` section:

```json5
"experimentalDecorators": true,
"emitDecoratorMetadata": true
```

### Using withBabel

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

## Examples

Please see [the examples](https://github.com/instantcommerce/next-api-decorators/tree/master/examples) to see how this library can be used.
