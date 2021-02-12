<p align="center">
  <a aria-label="Story of AMS logo" href="https://storyofams.com/" target="_blank" align="center">
    <img src="https://storyofams.com/public/story-of-ams-logo-small@3x.png" alt="Story of AMS" width="120">
  </a>
  <h1 align="center">@storyofams/next-api-decorators</h1>
</p>

<p align="center">Collection of decorators to create typed Next.js API routes, with easy request validation and transformation.</p>

---

## Installation

Add the package to your project:

```bash
$ yarn add @storyofams/next-api-decorators
```

Since decorators are still in proposal state, you need to add the following plugins to your `devDependencies` in order to use them:

```bash
$ yarn add -D babel-plugin-transform-typescript-metadata @babel/plugin-proposal-decorators babel-plugin-parameter-decorator
```

Your `tsconfig.json` needs the following flags:

```json
"experimentalDecorators": true,
"emitDecoratorMetadata": true
```

## Usage

### Basic example

```ts
// pages/api/user.ts
import {
  createHandler,
  Get,
  Post,
  HttpCode,
  Query,
  Body,
  NotFoundException
} from '@storyofams/next-api-decorators';

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

  // POST /api/user
  @Post()
  @HttpCode(201)
  public createUser(@Body() body: any) {
    return User.create(body);
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
import { createHandler, Post, Body } from '@storyofams/next-api-decorators';
import { IsNotEmpty, IsEmail } from 'class-validator';

class CreateUserDto {
  @IsNotEmpty()
  public name: string;

  @IsEmail()
  public email: string;
}

class User {
  @Post()
  public createUser(@Body() body: CreateUserDto) {
    return User.create(body);
  }
}

export default createHandler(User);
```

## Available decorators

### Class decorators

|             | Description                                                                |
| ----------- | -------------------------------------------------------------------------- |
| `SetHeader` | Sets a header value into the response for all routes defined in the class. |

### Method decorators

|             | Description                                               |
| ----------- | --------------------------------------------------------- |
| `Get`       | Marks the method as `GET` handler.                        |
| `Post`      | Marks the method as `POST` handler.                       |
| `Put`       | Marks the method as `PUT` handler.                        |
| `Delete`    | Marks the method as `DELETE` handler.                     |
| `SetHeader` | Sets a header name/value into the response for the route. |
| `HttpCode`  | Sets the http code the route response.                    |

### Parameter decorators

|                         | Description                                 |
| ----------------------- | ------------------------------------------- |
| `@Body()`               | Gets the request body.                      |
| `@Query(key: string)`   | Gets a query string parameter value by key. |
| `@Header(name: string)` | Gets a header value by name.                |




## Built-in pipes

Pipes are being used to validate and transform incoming values. The pipes can be added to the `@Query` decorator like:

```ts
@Query('isActive', ParseBooleanPipe) isActive: boolean
```

⚠️ Beware that they throw when the value is invalid.

|                    | Description                                  | Remarks                                       |
| ------------------ | -------------------------------------------- | --------------------------------------------- |
| `ParseNumberPipe`  | Validates and transforms `Number` strings.  | Uses `parseFloat` under the hood              |
| `ParseBooleanPipe` | Validates and transforms `Boolean` strings. | Allows `'true'` and `'false'` as valid values |


## Exceptions

The following built-in exceptions are provided by this package:

* `NotFoundException`
* `BadRequestException`


### Custom exceptions

Any exception class that extends the base `HttpException` will be handled by the built-in error handler.

```ts
import { HttpException } from '@storyofams/next-api-decorators';

export class ForbiddenException extends HttpException {
  public constructor(message?: string) {
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
