import { User, sampleUserData } from '../../../data/users';
import {
  Get,
  Query,
  createHandler,
  ParseNumberPipe,
  DefaultValuePipe,
  Param,
  NotFoundException,
} from '@storyofams/next-api-decorators';

class UserRouter {
  private users = sampleUserData;

  // GET /api/users
  @Get()
  public listUsers(
    @Query('skip', DefaultValuePipe(0), ParseNumberPipe) skip: number,
    @Query('limit', ParseNumberPipe({ nullable: true })) limit?: number,
  ): User[] {
    return this.users.slice(skip, limit);
  }

  // GET /api/users/:id
  @Get('/:id')
  public fetchUser(@Param('id', ParseNumberPipe) id: number): User {
    const user = this.users.find(({ id: uid }) => uid === id);

    if (!user) {
      throw new NotFoundException(`No user found with ID '${id}'.`);
    }

    return user;
  }
}

export default createHandler(UserRouter);
