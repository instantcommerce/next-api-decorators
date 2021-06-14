---
title: Decorator reference
slug: /api/decorators
---

## Class decorators

* `@SetHeader(key: string, value: string)` Sets a header key valur pair for all routes in a handler class.
* `@Catch(handler: (error: unknown, req: NextApiRequest, res: NextApiResponse) => void | Promise<void>, exceptionType?: ClassConstructor)` Creates an exception handler for a handler class.

## Method decorators

* `@SetHeader(key: string, value: string)` Sets a header key value pair for the route that the decorator is applied to.
* `@HttpCode(code: number)` Defines the HTTP response code of the route.
* `@Download()` Marks the method as a download handler for the client, so the returned file can be downloaded by the browser.
* `@Catch(handler: (error: unknown, req: NextApiRequest, res: NextApiResponse) => void | Promise<void>, exceptionType?: ClassConstructor)` Creates an exception handler for a route in a handler class.

### HTTP method decorators

The following decorators mark your class method as a handler for the corresponding HTTP verb.

* `Get(path?: string)`
* `Post(path?: string)`
* `Put(path?: string)`
* `Delete(path?: string)`

## Parameter decorators


|                         |                                |
| ----------------------- | ------------------------------ |
| `@Req()`, `@Request()`  | `req`                          |
| `@Res()`, `@Response()` | `res`                          |
| `@Query(key?: string)`  | `req.query` / `req.query[key]` |
| `@Header(key: string)`  | `req.headers[key]`             |
| `@Body()`               | `req.body`                     |
| `@Param(key: string)`   | `req.params[key]`              |
