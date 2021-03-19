import { sampleUserData } from '../../../data/users';
import {
  Get,
  Query,
  createHandler,
  ParseNumberPipe,
  DefaultValuePipe,
} from '@storyofams/next-api-decorators';

class User {
  // GET /api/users
  @Get()
  public async listUsers(
    @Query('skip', DefaultValuePipe(0), ParseNumberPipe) skip: number,
    @Query('limit', ParseNumberPipe({ nullable: true })) limit?: number,
  ) {
    return { users: sampleUserData.slice(skip, limit) };
  }
}

export default createHandler(User);
