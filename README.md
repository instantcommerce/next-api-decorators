<div align="center">
  <a aria-label="Story of AMS logo" href="https://storyofams.com/" target="_blank" align="center">
    <img src="https://avatars.githubusercontent.com/u/19343504" alt="Story of AMS" width="100">
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

<div align="center">
  A collection of decorators to create typed Next.js API routes, with easy request validation and transformation.

  [View docs](https://next-api-decorators.vercel.app/)
</div>

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

💡 Read more about validation [here](https://next-api-decorators.vercel.app/docs/validation)

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

Visit https://next-api-decorators.vercel.app/docs/#installation to get started.

## Documentation

Refer to our docs for usage topics:

[Validation](https://next-api-decorators.vercel.app/docs/validation)

[Route matching](https://next-api-decorators.vercel.app/docs/routing/route-matching)

[Using middlewares](https://next-api-decorators.vercel.app/docs/middlewares)

[Custimg middlewares](https://next-api-decorators.vercel.app/docs/middlewares#custom-middleware-decorators)

[Pipes](https://next-api-decorators.vercel.app/docs/pipes)

[Exceptions](https://next-api-decorators.vercel.app/docs/exceptions)

## Available decorators

### Class decorators

|                                           | Description                                                    |
| ----------------------------------------- | -------------------------------------------------------------- |
| `@SetHeader(name: string, value: string)` | Sets a header name/value into all routes defined in the class. |
| `@UseMiddleware(...middlewares: Middleware[])` | Registers one or multiple middlewares for all the routes defined in the class. |

### Method decorators

|                                           | Description                                       |
| ----------------------------------------- | ------------------------------------------------- |
| `@Get(path?: string)`                     | Marks the method as `GET` handler.                |
| `@Post(path?: string)`                    | Marks the method as `POST` handler.               |
| `@Put(path?: string)`                     | Marks the method as `PUT` handler.                |
| `@Delete(path?: string)`                  | Marks the method as `DELETE` handler.             |
| `@SetHeader(name: string, value: string)` | Sets a header name/value into the route response. |
| `@HttpCode(code: number)`                 | Sets the http code in the route response.         |
| `@UseMiddleware(...middlewares: Middleware[])` | Registers one or multiple middlewares for the handler. |

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
