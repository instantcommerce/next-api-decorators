import {
  createHandler,
  Get,
  ParseNumberPipe,
  Query,
} from '@storyofams/next-api-decorators';
import { sampleUserData } from '../../../data/users';

class User {
  // GET /api/users
  @Get()
  public async listUsers(
    @Query('skip', ParseNumberPipe({ nullable: true })) skip: number = 0,
    @Query('limit', ParseNumberPipe({ nullable: true })) limit?: number,
  ) {
    return { users: sampleUserData.slice(skip ?? 0, limit) };
  }
}

export default createHandler(User);
