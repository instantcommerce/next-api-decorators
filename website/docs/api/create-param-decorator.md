---
title: Custom parameter decorators
slug: /api/create-param-decorator
---

Parameter decorators are there to simplify the task of geting a specific data you need by using the request (`req`) object or by generating it. For example the `@Body` decorator we provide simply returns the `req.body` object.

By using the `createParamDecorator` function, you can create your own decorators that fulfill the needs of your application.

As a basic example, let's get the browser information of the client via a decorator.

First we create our decorator:
```ts
import { createParamDecorator } from 'next-api-decorators';

export const UserAgent = createParamDecorator<string | undefined>(
  req => req.headers['user-agent']
);
```

Later we can use the decorator in our handler:
```ts
...
class CommentHandler {
  @Get()
  public comments(@UserAgent() userAgent?: string) {
    return `Someone requested the comments via "${userAgent ?? 'Unknown browser'}"`;
  }
}
...
```