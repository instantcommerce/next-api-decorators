---
title: Basics
slug: /routing/basics
---

## Introduction

Defining routes are partially dictated by Next.js and can be read in depth [here](https://nextjs.org/docs/api-routes/introduction).

We provide the following built-in decorators for you to handle the HTTP method that corresponds to each:
* `Get`
* `Post`
* `Put`
* `Delete`

Since Next.js expects the default export to be a request handler, we provide the `createHandler` function which accepts a class as the only parameter.

```ts
import { createHandler, Get } from '@storyofams/next-api-decorators';

class UserHandler {
  @Get()
  users() {
    return 'Our users';
  }
}

export default createHandler(UserHandler);
```

## Request object

In certain cases we may need to access the underlying request (`req`) object. We can access it by using the `@Req` decorator.

:::info
There is the `@Request()` decorator as well, which is an alias to the `@Req` decorator.
:::

```ts
import { Get, Req } from '@storyofams/next-api-decorators';
import { Request } from 'express';

class UserHandler {
  @Get()
  users(@Req() req: Request) {
    return `The url you requested: ${req.url}`
  }
}
```

In most cases, you won't need to access the request object since we provide decorators for most use cases, such as `@Body` and `@Query`. You can read more about the decorators [here](/docs/api/decorators)

## Status code

By default, the response status code is `200`, unless the returned value is `null` or `undefined`. In that case, the response status code is `204`. However, it's possible to change it per route.

```ts
import { Post, HttpCode } from '@storyofams/next-api-decorators';

class UserHandler {
  @Post()
  @HttpCode(201)
  create() {
    return 'You just created a new user.';
  }
}
```

## Headers

Depending on your use case, you may either want to read a header value, set a custom one or do both. We provide `@Header` parameter decorator to read, and `@SetHeader` to set.

```ts
import { Get, SetHeader } from '@storyofams/next-api-decorators';

class UserHandler {
  @Get()
  @SetHeader('Content-Type', 'text/plain')
  users(@Header('Referer') referer: string) {
    return `Your referer is ${referer}`;
  }
}
```

## Request payloads

In the [example](#status-code) above we created a `POST` request handler but we didn't expect the client to send any payload. Let's say, now we do want some data from the client, so first we need to determine the shape of the payload we expect. In order to do that we will use classes, which are part of the ES6 standard.

```ts
class CreateUserInput {
  email: string;
  fullName: string;
}

class UserHandler {
  @Post()
  create(@Body() body: CreateUserInput) {
    // Do something with the body
    return `A new user is created with email address "${body.email}"`;
  }
}
```

:::note
In theory, it's possible to use interfaces if you are using TypeScript. However, in order to make use of the `ValidationPipe` using classes is the only way. You can read [why](/docs/validation#class-vs-interface) here.
:::