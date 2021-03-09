<div align="center">
  <a aria-label="Story of AMS logo" href="https://storyofams.com/" target="_blank" align="center">
    <img src="https://storyofams.com/public/story-of-ams-logo-small@3x.png" alt="Story of AMS" width="120">
  </a>
  <h1 align="center">@storyofams/next-api-decorators</h1>
  <p align="center">
    <a aria-label="releases" href="https://GitHub.com/storyofams/next-api-decorators/releases/" target="_blank">
      <img src="https://github.com/storyofams/next-api-decorators/workflows/Release/badge.svg">
    </a>
    <a aria-label="npm" href="https://www.npmjs.com/package/@storyofams/next-api-decorators" target="_blank">
      <img src="https://img.shields.io/npm/v/@storyofams/next-api-decorators">
    </a>
    <a aria-label="codecov" href="https://codecov.io/gh/storyofams/nextjs-api-decorators" target="_blank">
      <img src="https://codecov.io/gh/storyofams/next-api-decorators/branch/master/graph/badge.svg?token=ZV0YT4HU5H">
    </a>
    <a aria-label="stars" href="https://github.com/storyofams/next-api-decorators/stargazers/" target="_blank">
      <img src="https://img.shields.io/github/stars/storyofams/next-api-decorators.svg?style=social&label=Star&maxAge=86400" />
    </a>
  </p>
</div>

---

This package contains a collection of decorators to create typed Next.js API routes, with easy request validation and transformation.

## Motivation

Building serverless functions declaratively with classes and decorators makes dealing with Next.js API routes easier and brings order and sanity to your `/pages/api` codebase.

The structure is heavily inspired by NestJS, which is an amazing framework for a lot of use cases. Having said that, a separate NestJS repo for your backend can also bring unneeded overhead and complexity to projects with a smaller set of backend requirements. Combining the structure of NestJS, with the ease of use of Next.js, brings the best of both worlds for the right use case.


## Installation

Add the package to your project:

```bash
$ yarn add @storyofams/next-api-decorators
```

Since decorators are still in proposal state, you need to add the following plugins to your `devDependencies` in order to use them:

```bash
$ yarn add -D babel-plugin-transform-typescript-metadata @babel/plugin-proposal-decorators babel-plugin-parameter-decorator
```

Make sure to add the following lines to the start of the `plugins` section in your babel configuration file:
```json
{
  "plugins": [
    "babel-plugin-transform-typescript-metadata",
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    "babel-plugin-parameter-decorator",
    // ... other plugins
  ]
}
```

Your `tsconfig.json` needs the following flags:

```json
"experimentalDecorators": true
```


## Usage

### Basic example

```ts
// pages/api/user.ts
import { createHandler, Get, Query, NotFoundException } from '@storyofams/next-api-decorators';

class User {
  // GET /api/user
  @Get()
  public async fetchUser(@Query('id') id: string) {
    const user = await DB.findUserById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }
}

export default createHandler(User);
```

### Data transfer object

If you want to use `class-validator` to validate request bodies and get them as DTOs, add it to your project by running:

```bash
$ yarn add class-validator class-transformer
```

Then you can define your DTOs like:

```ts
// pages/api/user.ts
import { createHandler, Post, HttpCode, Body } from '@storyofams/next-api-decorators';
import { IsNotEmpty, IsEmail } from 'class-validator';

class CreateUserDto {
  @IsNotEmpty()
  public name: string;

  @IsEmail()
  public email: string;
}

class User {
  // POST /api/user
  @Post()
  @HttpCode(201)
  public createUser(@Body() body: CreateUserDto) {
    return User.create(body);
  }
}

export default createHandler(User);
```


## Available decorators

### Class decorators

|                                           | Description                                                    |
| ----------------------------------------- | -------------------------------------------------------------- |
| `@SetHeader(name: string, value: string)` | Sets a header name/value into all routes defined in the class. |

### Method decorators

|                                           | Description                                       |
| ----------------------------------------- | ------------------------------------------------- |
| `@Get()`                                  | Marks the method as `GET` handler.                |
| `@Post()`                                 | Marks the method as `POST` handler.               |
| `@Put()`                                  | Marks the method as `PUT` handler.                |
| `@Delete()`                               | Marks the method as `DELETE` handler.             |
| `@SetHeader(name: string, value: string)` | Sets a header name/value into the route response. |
| `@HttpCode(code: number)`                 | Sets the http code in the route response.         |

### Parameter decorators

|                         | Description                                 |
| ----------------------- | ------------------------------------------- |
| `@Req()`                | Gets the request object.                    |
| `@Res()`*               | Gets the response object.                   |
| `@Body()`               | Gets the request body.                      |
| `@Query(key: string)`   | Gets a query string parameter value by key. |
| `@Header(name: string)` | Gets a header value by name.                |

\* Note that when you inject `@Res()` in a method handler you become responsible for managing the response. When doing so, you must issue some kind of response by making a call on the response object (e.g., `res.json(...)` or `res.send(...)`), or the HTTP server will hang.

## Built-in pipes

Pipes are being used to validate and transform incoming values. The pipes can be added to the `@Query` decorator like:

```ts
@Query('isActive', ParseBooleanPipe) isActive: boolean
```

⚠️ Beware that they throw when the value is invalid.

|                    | Description                                 | Remarks                                            |
| ------------------ | ------------------------------------------- | -------------------------------------------------- |
| `ParseBooleanPipe` | Validates and transforms `Boolean` strings. | Allows `'true'` and `'false'` as valid values.     |
| `ParseDatePipe`    | Validates and transforms `Date` strings.    | Allows valid `ISO 8601` formatted date strings.    |
| `ParseNumberPipe`  | Validates and transforms `Number` strings.  | Uses `parseFloat` under the hood.                  |
| `ValidateEnumPipe` | Validates string based on `Enum` values.    | Allows strings that are present in the given enum. |

## Exceptions

The following common exceptions are provided by this package.

|                                | Status code | Default message           |
| ------------------------------ | ----------- | ------------------------- |
| `BadRequestException`          | `400`       | `'Bad Request'`           |
| `UnauthorizedException`        | `401`       | `'Unauthorized'`          |
| `NotFoundException`            | `404`       | `'Not Found'`             |
| `UnprocessableEntityException` | `422`       | `'Unprocessable Entity'`  |
| `InternalServerErrorException` | `500`       | `'Internal Server Error'` |

### Custom exceptions

Any exception class that extends the base `HttpException` will be handled by the built-in error handler.

```ts
import { HttpException } from '@storyofams/next-api-decorators';

export class ForbiddenException extends HttpException {
  public constructor(message?: string = 'Forbidden') {
    super(403, message);
  }
}
```

Then later in the app, we can use it in our route handler:

```ts
class Events {
  @Get()
  public events() {
    throw new ForbiddenException();
  }
}
```
