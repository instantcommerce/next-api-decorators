import { NextApiRequest, NextApiResponse } from 'next';
import 'reflect-metadata';
import request from 'supertest';
import { createHandler, Get, UnauthorizedException } from '../lib';
import { createMiddlewareDecorator, MiddlewarePosition, NextFunction } from '../lib/decorators';
import { setupServer } from './setupServer';

const nowDate = Date.now().toString();

const AttachRequestTime = createMiddlewareDecorator(
  MiddlewarePosition.BEFORE,
  async (_: any, res: NextApiResponse, next: NextFunction) => {
    // Test asynchronicity by faking it
    await new Promise<void>(resolve => {
      setTimeout(() => {
        res.setHeader('x-time', nowDate);
        resolve();
      }, 200);
    });
    next();
  }
);

const FakeAuthGuard = createMiddlewareDecorator(
  MiddlewarePosition.BEFORE,
  async (req: NextApiRequest, _: any, next: NextFunction) => {
    // Another fake async
    await new Promise(resolve => setTimeout(resolve, 200));
    if (req.headers['x-api-key'] !== 'SECRET') {
      throw new UnauthorizedException();
    }

    next();
  }
);

@AttachRequestTime()
class TestHandler {
  @Get()
  @FakeAuthGuard()
  public index() {
    return null;
  }
}

describe('E2E - Custom middleware decorators', () => {
  let server: ReturnType<typeof setupServer>;
  beforeAll(() => {
    server = setupServer(createHandler(TestHandler));
  });

  afterAll(() => {
    if ('close' in server && typeof server.close === 'function') {
      server.close();
    }
  });

  it('Should attach x-time and pass the fake auth guard.', () =>
    request(server)
      .get('/api/test')
      .set('x-api-key', 'SECRET')
      .expect(204)
      .then(res => expect(res.headers).toHaveProperty('x-time', nowDate)));

  it('Should attach x-time and fail for the fake auth guard.', () =>
    request(server)
      .get('/api/test')
      .expect(401)
      .then(res => {
        expect(res.headers).toHaveProperty('x-time', nowDate);
        expect(res.body).toMatchObject({
          statusCode: 401,
          message: 'Unauthorized'
        });
      }));
});
