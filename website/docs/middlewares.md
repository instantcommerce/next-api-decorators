---
title: Middlewares
slug: /middlewares
---

`next-api-decorators` is technically compatible with all Express.js middlewares. However, keep in mind that some middlewares may not be compatible with Next.js API routes. When using a 3rd party middleware in a Next.js API handler, it's advised to test the middleware thoroughly.

We provide the `@UseMiddleware` decorator to run a middleware **_before_** the handler. You can use the decorator either for a class or a class method

### Applying a middleware

```ts
const rateLimiter = rateLimit();

@UseMiddleware(rateLimiter)
class ArticleHandler {
  @Get()
  public articles() {
    return 'My articles';
  }
}
```

### Custom middleware decorators

In some cases, it may be beneficial to create a middleware decorator and use it throughout your app.

We provide the `createMiddlewareDecorator` function for you to create a decorator that fulfills your needs.

```ts
const JwtAuthGuard =
  createMiddlewareDecorator((req: NextApiRequest, res: NextApiResponse, next: NextFunction) {
    if (!validateJwt(req)) {
      throw new UnauthorizedException();
      // or
      return next(new UnauthorizedException());
    }

    next();
  });

class SecureHandler {
  @Get()
  @JwtAuthGuard()
  public securedData(): string {
    return 'Secret data';
  }
}
```

:::info
`NextFunction` type is exported from `@storyofams/next-api-decorators`.
:::