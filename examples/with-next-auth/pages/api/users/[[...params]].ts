import {
  Get,
  Query,
  createHandler,
  ParseNumberPipe,
  DefaultValuePipe,
  createMiddlewareDecorator,
  NextFunction,
  UnauthorizedException,
  SetHeader,
} from '@storyofams/next-api-decorators';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import { User, sampleUserData } from '../../../data';

declare module 'next' {
  interface NextApiRequest {
    user?: { name: string }
  }
}

const NextAuthGuard = createMiddlewareDecorator(async (req: NextApiRequest, _res: NextApiResponse, next: NextFunction) => {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  if (!token || !token.name) {
    throw new UnauthorizedException();
  }

  req.user = { name: token.name };
  next();
});

@NextAuthGuard()
class UserRouter {
  // GET /api/users
  @Get()
  @SetHeader('Cache-Control', 'nostore')
  public listUsers(
    @Query('skip', DefaultValuePipe(0), ParseNumberPipe) skip: number,
    @Query('limit', ParseNumberPipe({ nullable: true })) limit?: number,
  ): User[] {
    return sampleUserData.slice(skip, limit);
  }
}

export default createHandler(UserRouter);
