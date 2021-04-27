---
title: Pipes
slug: /pipes
---

Pipes are being used to validate and transform incoming values. They can be applied to the `@Query`, `@Body` and `@Param` decorators.

## Built-in pipes

### ParseBooleanPipe

Validates and transforms `Boolean` strings. Allows `'true'` and `'false'`.

```ts
class UserHandler {
  @Get()
  users(@Query('active', ParseBooleanPipe) active: boolean) {
    // Do something with the `active` argument.
    return 'Active users';
  }
}
```

### ParseDatePipe

Validates and transforms `Date` strings. Allows valid `ISO 8601` formatted date strings.

```ts
class UserHandler {
  @Get()
  users(@Query('registrationDate', ParseDatePipe) registrationDate: Date) {
    // Do something with the `startFrom` argument.
    return `List of users that registered on ${registrationDate}.`;
  }
}
```

### ParseNumberPipe

Validates and transforms `Number` strings. Uses `parseFloat` under the hood.

```ts
class UserHandler {
  @Get()
  users(@Query('limit', ParseNumberPipe) limit: number) {
    // Do something with the `skip` argument.
    return `Returning the first ${limit} users.`;
  }
}
```

### ValidateEnumPipe [^1]

Validates string based on `Enum` values. Allows strings that are present in the enum.

```ts
enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  STAFF = 'staff',
  CUSTOMER = 'customer'
}

class UserHandler {
  @Get()
  users(@Query(ValidateEnumPipe({ type: UserRole })) role: UserRole) {
    // Do something with the `role` argument.
    return `Users that have the role ${role}`;
  }
}
```

### ValidationPipe

Validates the request body via `class-validator`. Works only when `class-validator` and `class-transformer` packages are installed.

Since validation is a topic on its own, you can read more about it [here](/docs/validation)

### DefaultValuePipe [^1]

Assigns a default value to the parameter when its value is `null` or `undefined`.

:::caution
Beware that pipes (except for the `DefaultValuePipe`) throw when the value is `undefined` or invalid. Read about optional values below.
:::

## Optional values

Pipes are non-nullable by default. However, the following pipes allow options to be passed as an argument and have the `nullable` property in their options:

- `ParseBooleanPipe`
- `ParseDatePipe`
- `ParseNumberPipe`
- `ValidateEnumPipe`

Usage:
```ts
@Query('isActive', ParseBooleanPipe({ nullable: true })) isActive?: boolean
```

---

#### Footnotes
[^1]: Bare function usage has no effect for these pipes. In other words, always use `@Query('step', DefaultValuePipe(1))` rather than `@Query('step', DefaultValuePipe)`.