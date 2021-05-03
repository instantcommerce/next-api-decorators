---
title: Exceptions
slug: /exceptions
---

The following common exceptions are provided by this package.

|                                | Status code | Default message           |
| ------------------------------ | ----------- | ------------------------- |
| `BadRequestException`          | `400`       | `'Bad Request'`           |
| `UnauthorizedException`        | `401`       | `'Unauthorized'`          |
| `NotFoundException`            | `404`       | `'Not Found'`             |
| `PayloadTooLargeException`     | `413`       | `'Payload Too Large'`     |
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
