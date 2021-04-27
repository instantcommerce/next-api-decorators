---
title: Basic comparison
slug: /introduction/basic-comparison
---

Assuming you have a handler (`pages/api/user.ts`) to get the details of a user, and to create a user in which you also validate the incoming data.

You'd write your function like below, in the basic manner.

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

  res.status(405).json({
    statusCode: 405,
    message: 'Method Not Allowed'
  });
}
```

But, with `next-api-decorators` you can write the same handler in a declarative manner:

```ts
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

:::info
Read more about validation [here](/docs/validation)
:::