<p align="center">
  <a aria-label="Story of AMS logo" href="https://storyofams.com/" target="_blank" align="center">
    <img src="https://storyofams.com/public/story-of-ams-logo-small@3x.png" alt="Story of AMS" width="120">
  </a>
  <h1 align="center">@storyofams/next-api-decorators</h1>
</p>

<p align="center">Collection of decorators to create structured API routes with Next.js.</p>

---

## Usage

Since decorators are still in proposal state, you need to add the following plugins to your project in order to use them.

```bash
$ yarn add -D babel-plugin-transform-typescript-metadata @babel/plugin-proposal-decorators babel-plugin-parameter-decorator
```

```ts
// pages/api/test.ts
import { createHandler, Get, NotFoundException } from '@storyofams/next-api-decorators';

class User {
  @Get()
  public async fetchUser(@Query('id') id: string) {
    const user = await User.findById(id);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  @Post()
  public createUser(@Body() body: any) {
    return User.create(body);
  }

  @Put()
  public async updateUser(@Query('id') id: string, @Body() body: Record<string, string>) {
    const user = await User.findById(id);
    
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    user.firstName = body.firstName;
    user.lastName = body.lastName;

    return user.save();
  }

  @Delete()
  public async deleteUser(@Query('id') id: string) {
    await User.deleteOne({ id });
  }
}

export default createHandler(User);
```

If you want to use `class-validator` to validate request bodies and get them as DTOs, add it to your project by running:

```bash
$ yarn add class-validator
```

Then you can define your DTOs like below:

```ts
// pages/api/test.ts
import { createHandler, Get, NotFoundException } from '@storyofams/next-api-decorators';
import { IsNotEmpty } from 'class-validator';

class CreateUserDto {
  @IsNotEmpty()
  public firstName: string;

  @IsNotEmpty()
  public lastName: string;
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
|             | Description |
| ----        | ----------- |
| `SetHeader` | Sets a header value into the response for all routes defined in the class.

### Method decorators
|             | Description |
| ---         | ----------- |
| `Get`       | Marks the method as `GET` handler.
| `Post`      | Marks the method as `POST` handler.
| `Put`       | Marks the method as `PUT` handler.
| `Delete`    | Marks the method as `DELETE` handler.
| `SetHeader` | Sets a header key/value into the response for the route.
| `HttpCode`  | Sets the http code the route response.

### Parameter decorators
|                         | Description |
| ----------------------- | ----------- |
| `@Query(name: string)`  | Gets a query string parameter value. |
| `@Body()`               | Gets the request body |
| `@Header(name: string)` | Gets a header value. |
