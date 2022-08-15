import {
  Get,
  Post,
  Put,
  Delete,
  HttpCode,
  Query,
  Body,
  Param,
  createHandler,
  ValidationPipe,
  ParseNumberPipe,
  DefaultValuePipe,
  NotFoundException,
} from '@instantcommerce/next-api-decorators';
import { User, sampleUserData } from '../../../data';
import { CreateUserInput, UpdateUserInput } from '../../../dto';

class UserRouter {
  // Mimic database for example purposes
  private users = sampleUserData;
  private lastUserId = sampleUserData[sampleUserData.length - 1].id;

  private findUserById(id: number): User {
    const user = this.users.find(({ id: uid }) => uid === id);

    if (!user) {
      throw new NotFoundException(`No user found with ID '${id}'.`);
    }

    return user;
  }

  // GET /api/users (read many)
  @Get()
  public listUsers(
    @Query('skip', DefaultValuePipe(0), ParseNumberPipe) skip: number,
    @Query('limit', ParseNumberPipe({ nullable: true })) limit?: number,
  ): User[] {
    return this.users.slice(skip, limit);
  }

  // POST /api/users (create one)
  @Post()
  @HttpCode(201)
  public createUser(@Body(ValidationPipe) body: CreateUserInput): User {
    const user: User = { id: ++this.lastUserId, ...body };
    this.users.push(user);
    return user;
  }

  // GET /api/users/:id (read one)
  @Get('/:id')
  public fetchUser(@Param('id', ParseNumberPipe) id: number): User {
    return this.findUserById(id);
  }

  // PUT /api/users/:id (update one)
  @Put('/:id')
  public updateUser(
    @Param('id', ParseNumberPipe) id: number,
    @Body(ValidationPipe) body: UpdateUserInput,
  ): User {
    const user = this.findUserById(id);

    user.name = body.name ?? user.name;
    user.email = body.email ?? user.email;

    return user;
  }

  // POST /api/users/:id (delete one)
  @Delete('/:id')
  @HttpCode(204)
  public deleteUser(@Param('id', ParseNumberPipe) id: number): void {
    const index = this.users.findIndex(({ id: uid }) => uid === id);

    if (index > -1) {
      this.users.splice(index, 1);
    }
  }
}

export default createHandler(UserRouter);
