---
title: Basics
slug: /introduction/basics
---

## Introduction

Defining routes are partially dictated by Next.js and can be read in depth [here](https://nextjs.org/docs/api-routes/introduction).

We provide the following built-in decorators for you to handle the HTTP method that corresponds to each:
* `@Get()`
* `@Post()`
* `@Put()`
* `@Delete()`
* `@Patch()`

Since Next.js expects the default export to be a request handler, we provide the `createHandler` function which accepts a class as the only parameter.

```ts
import { createHandler, Get } from 'next-api-decorators';

class UserHandler {
  @Get()
  users() {
    return 'Our users';
  }
}

export default createHandler(UserHandler);
```

## Request object

In certain cases we may need to access the underlying request (`req`) object. We can access it by using the `@Req()` decorator.

:::info
There is the `@Request()` decorator as well, which is an alias to the `@Req()` decorator.
:::

```ts
import { createHandler, Get, Req } from 'next-api-decorators';
import { NextApiRequest } from 'next';

class UserHandler {
  @Get()
  users(@Req() req: NextApiRequest) {
    return `The url you requested: ${req.url}`
  }
}

export default createHandler(UserHandler);
```

In most cases, you won't need to access the request object since we provide decorators for most use cases, such as `@Body` and `@Query`. You can read more about the decorators [here](/docs/api/decorators)

## Status code

By default, the response status code is `200`, unless the returned value is `null` or `undefined`. In that case, the response status code is `204`. However, it's possible to change it per route.

```ts
import { createHandler, Post, HttpCode } from 'next-api-decorators';

class UserHandler {
  @Post()
  @HttpCode(201)
  create() {
    return 'You just created a new user.';
  }
}

export default createHandler(UserHandler);
```

## Headers

Depending on your use case, you may either want to read a header value, set a custom one or do both. We provide `@Header` parameter decorator to read, and `@SetHeader` to set.

```ts
import { createHandler, Get, Header, SetHeader } from 'next-api-decorators';

class UserHandler {
  @Get()
  @SetHeader('Content-Type', 'text/plain')
  users(@Header('Referer') referer: string) {
    return `Your referer is ${referer}`;
  }
}

export default createHandler(UserHandler);
```

## Request payloads

In the [example](#status-code) above we created a `POST` request handler but we didn't expect the client to send any payload. Let's say, now we do want some data from the client, so first we need to determine the shape of the payload we expect. In order to do that we will use classes, which are part of the ES6 standard.

```ts
import { createHandler, Post, Body } from 'next-api-decorators';

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

export default createHandler(UserHandler);
```

:::note
In theory, it's possible to use interfaces if you are using TypeScript. However, in order to make use of the `ValidationPipe` using classes is the only way. You can read [why](/docs/validation#class-vs-interface) here.
:::

## Return a file to be downloaded

When a handler needs to return a file to be downloaded by the client, you can use the `@Download()` decorator, which sets the necessary headers into the response. However, the returning object must comply with the following interface:

```ts
interface DownloadFileResult {
  filename: string;
  contents: Stream | Buffer | string;
  contentType?: string
}
```

Usage in a handler:
```ts
// src/pages/api/files/[[...params]].ts
import { createReadStream } from 'fs';
import { createHandler, Download, Get } from 'next-api-decorators';

class FileHandler {
  @Get('/whitepaper')
  @Download()
  public downloadWhitepaper() {
    const filename = 'whitepaper.pdf';

    return {
      filename,
      contents: fs.createReadStream(filename),
      contentType: 'application/pdf'
    }
  }
}

export default createHandler(FileHandler);
```

## Basic comparison

Assuming you have a handler (`pages/api/user.ts`) to get the details of a user, and to create a user in which you also validate the incoming data.

In a naive way, you'd write your function like below:

```ts
export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const user = await DB.findUserById(req.query.id);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User not found'
      })
    }

    return res.json(user);
  } else if (req.method === 'POST') {
    // Very primitive e-mail address validation.
    if (!req.body.email || (req.body.email && !req.body.email.includes('@'))) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Invalid e-mail address.'
      })
    }

    const user = await DB.createUser(req.body.email);
    return res.status(201).json(user);
  }

  res.status(405).json({
    statusCode: 405,
    message: 'Method Not Allowed'
  });
}
```

However, with `next-api-decorators` you can write the same handler in a declarative manner:

```ts
import { createHandler, Body, Get, HttpCode, NotFoundException, Post, Query, ValidationPipe } from 'next-api-decorators';

class User {
  // GET /api/user
  @Get()
  async fetchUser(@Query('id') id: string) {
    const user = await DB.findUserById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  // POST /api/user
  @Post()
  @HttpCode(201)
  async createUser(@Body(ValidationPipe) body: CreateUserDto) {
    return await DB.createUser(body.email);
  }
}

export default createHandler(User);
```

:::info
Read more about validation [here](/docs/validation)
:::