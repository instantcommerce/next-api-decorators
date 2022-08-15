---
title: Route matching
slug: /routing/route-matching
---

It is possible to use Express.js style route matching with parameters within your handlers. To enable this functionality add the `path-to-regexp` package to your project by running:

```bash npm2yarn
npm install path-to-regexp
```

Then you can define your routes in your handler like:

```ts
// pages/api/user/[[...params]].ts
import { createHandler, Get, Param } from '@instantcommerce/next-api-decorators';

class UserHandler {
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

export default createHandler(UserHandler);
```

:::info
File names are important for route matching. Read more at https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
:::

:::caution
When `path-to-regexp` package is not installed and route matching is being used in handlers, the request will be handled by the method defined with the `/` path (keep in mind that using `@Get()` and `@Get('/')` do exactly the same thing).

For the above example, a request to `api/user/123` will be handled by the `list` method if `path-to-regexp` package is not installed in your project.
:::