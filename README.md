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
    <a aria-label="codecov" href="https://codecov.io/gh/storyofams/next-api-decorators" target="_blank">
      <img src="https://codecov.io/gh/storyofams/next-api-decorators/branch/master/graph/badge.svg?token=ZV0YT4HU5H">
    </a>
    <a aria-label="stars" href="https://github.com/storyofams/next-api-decorators/stargazers/" target="_blank">
      <img src="https://img.shields.io/github/stars/storyofams/next-api-decorators.svg?style=social&label=Star&maxAge=86400" />
    </a>
  </p>
</div>

---

This package contains a collection of decorators to create typed Next.js API routes, with easy request validation and transformation.

---

## Basic usage

```ts
// pages/api/user.ts
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

💡 Read more about validation [here](#data-transfer-object)

<details>
  <summary>The code above without next-api-decorators</summary>

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

    res.status(404).json({
      statusCode: 404,
      message: 'Not Found'
    });
  }
  ```
</details>

---

## Motivation

Building serverless functions declaratively with classes and decorators makes dealing with Next.js API routes easier and brings order and sanity to your `/pages/api` codebase.

The structure is heavily inspired by NestJS, which is an amazing framework for a lot of use cases. On the other hand, a separate NestJS repo for your backend can also bring unneeded overhead and complexity to projects with a smaller set of backend requirements. Combining the structure of NestJS, with the ease of use of Next.js, brings the best of both worlds for the right use case.


## Installation

Add the package to your project:

```bash
$ yarn add @storyofams/next-api-decorators
```

Since decorators are still in proposal state, you need to add the following plugins to your `devDependencies` in order to use them:

```bash
$ yarn add -D @babel/core babel-plugin-transform-typescript-metadata @babel/plugin-proposal-decorators babel-plugin-parameter-decorator
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

Your `tsconfig.json` needs the following flags:

```json5
"experimentalDecorators": true
```


## Usage

### Data transfer object

If you want to use `class-validator` to validate request bodies and get them as DTOs, add it to your project by running:

```bash
$ yarn add class-validator class-transformer
```

Then you can define your DTOs like:

```ts
// pages/api/user.ts
import { createHandler, Post, HttpCode, Body, ValidationPipe } from '@storyofams/next-api-decorators';
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
  public createUser(@Body(ValidationPipe) body: CreateUserDto) {
    return User.create(body);
  }
}

export default createHandler(User);
```

### Route matching

It is possible to use Express.js style route matching within your handlers. To enable the functionality add the `path-to-regexp` package to your project by running:
```bash
$ yarn add path-to-regexp
```

Then you can define your routes in your handler like:
```ts
// pages/api/user/[[...api]].ts
class User {
  @Get()
  public list() {
    return DB.findAllUsers();
  }

  @Get('/:id')
  public details(@Param('id') id: string) {
    return DB.findUserById(id);
  }

  @Get('/:userId/comments')
  public comments(@Param('userId') userId: string) {
    return DB.findUserComments(userId);
  }

  @Get('/:userId/comments/:commentId')
  public commentDetails(@Param('userId') userId: string, @Param('commentId') commentId: string) {
    return DB.findUserCommentById(userId, commentId);
  }
}
```

📖 File names are important for route matching. Read more at https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes

💡 It is possible to use pipes with `@Param`. e.g: `@Param('userId', ParseNumberPipe) userId: number`

⚠️ When `path-to-regexp` package is not installed and route matching is being used in handlers, the request will be handled by the method defined with the `/` path (keep in mind that using `@Get()` and `@Get('/')` do exactly the same thing).

For the above example, a request to `api/user/123` will be handled by the `list` method if `path-to-regexp` package is not installed in your project.


## Available decorators

### Class decorators

|                                           | Description                                                    |
| ----------------------------------------- | -------------------------------------------------------------- |
| `@SetHeader(name: string, value: string)` | Sets a header name/value into all routes defined in the class. |

### Method decorators

|                                           | Description                                       |
| ----------------------------------------- | ------------------------------------------------- |
| `@Get(path?: string)`                                  | Marks the method as `GET` handler.                |
| `@Post(path?: string)`                                 | Marks the method as `POST` handler.               |
| `@Put(path?: string)`                                  | Marks the method as `PUT` handler.                |
| `@Delete(path?: string)`                               | Marks the method as `DELETE` handler.             |
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
| `@Param(key: string)`   | Gets a route parameter value by key.        |

\* Note that when you inject `@Res()` in a method handler you become responsible for managing the response. When doing so, you must issue some kind of response by making a call on the response object (e.g., `res.json(...)` or `res.send(...)`), or the HTTP server will hang.

## Built-in pipes

Pipes are being used to validate and transform incoming values. The pipes can be added to the `@Query` decorator like:

```ts
@Query('isActive', ParseBooleanPipe) isActive: boolean
```

⚠️ Beware that pipes throw when the value is `undefined` or invalid. Read about optional values [here](#handling-optional-values-in-conjunction-with-pipes)

|                    | Description                                       | Remarks                                                                           |
| ------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------- |
| `ParseBooleanPipe` | Validates and transforms `Boolean` strings.       | Allows `'true'` and `'false'` as valid values.                                    |
| `ParseDatePipe`    | Validates and transforms `Date` strings.          | Allows valid `ISO 8601` formatted date strings.                                   |
| `ParseNumberPipe`  | Validates and transforms `Number` strings.        | Uses `parseFloat` under the hood.                                                 |
| `ValidateEnumPipe` | Validates string based on `Enum` values.          | Allows strings that are present in the given enum.                                |
| `ValidationPipe`   | Validates the request body via `class-validator`. | Works only when `class-validator` and `class-transformer` packages are installed. |


### Handling optional values in conjunction with pipes

Pipes are non-nullable by default. However, the following pipes allow options to be passed as an argument and have the `nullable` property in their options:

- `ParseBooleanPipe`
- `ParseDatePipe`
- `ParseNumberPipe`
- `ValidateEnumPipe`

Usage:
```ts
@Query('isActive', ParseBooleanPipe({ nullable: true })) isActive?: boolean
```

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
