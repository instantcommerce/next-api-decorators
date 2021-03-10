import {
  createHandler,
  Get,
  NotFoundException,
  ParseNumberPipe,
  Query,
} from '@storyofams/next-api-decorators';
import { sampleUserData } from '../../../data/users';

class User {
  // GET /api/users/:id
  @Get()
  public async fetchUser(@Query('id', ParseNumberPipe) id: number) {
    const user = sampleUserData.find(({ id: uid }) => uid === id);

    if (!user) {
      throw new NotFoundException(`No user not found with ID '${id}'.`);
    }

    return user;
  }
}

export default createHandler(User);
