import { NextApiRequest, NextApiResponse } from 'next';
import request from 'supertest';
import { BadRequestException, createHandler, Get, UseBefore } from '../lib';
import { NextFunction } from '../lib/decorators';
import { setupServer } from './setupServer';

const messages: string[] = [];

@UseBefore(
  (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    if (req.url?.includes('/will-throw')) {
      throw new Error('An error occurred.');
    } else if (req.url?.includes('/bad-request')) {
      throw new BadRequestException();
    } else if (req.url?.includes('/return-error')) {
      return next(new BadRequestException());
    }

    res.status(400).end();
    next();
  },
  (_: any, __: any, next: NextFunction) => {
    messages.push('A message.');
    next();
  }
)
class TestHandler {
  @Get()
  public index(): string {
    return 'Hello!';
  }

  @Get('/will-throw')
  public willThrow(): string {
    return 'An error!';
  }

  @Get('/bad-request')
  public badRequest(): string {
    return 'Bad Request';
  }

  @Get('/return-error')
  public returnError(): null {
    return null;
  }
}

describe('E2E - Middleware - Errors', () => {
  let server: ReturnType<typeof setupServer>;
  beforeAll(() => (server = setupServer(createHandler(TestHandler))));
  afterAll(() => {
    if ('close' in server && typeof server.close === 'function') {
      server.close();
    }
  });

  it('Should not run the other middlewares when a response is written in the previous middleware.', async () => {
    await request(server).get('/api/test');
    expect(messages).toHaveLength(0);
  });

  it('Should return 500 when a middleware throws a standard Error.', () =>
    request(server)
      .get('/api/test/will-throw')
      .expect(500)
      .then(res =>
        expect(res.body).toMatchObject({
          statusCode: 500,
          message: 'An unknown error occurred.'
        })
      ));

  it('Should have the necessary properties when a middleware throws a built-in error.', () =>
    request(server)
      .get('/api/test/bad-request')
      .expect(400)
      .then(res =>
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'Bad Request'
        })
      ));

  it('Should have the necessary properties when a middleware uses the callback with a built-in error.', () =>
    request(server)
      .get('/api/test/return-error')
      .expect(400)
      .then(res =>
        expect(res.body).toMatchObject({
          statusCode: 400,
          message: 'Bad Request'
        })
      ));
});
