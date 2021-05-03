import 'reflect-metadata';
import { NextApiResponse } from 'next';
import request from 'supertest';
import { createHandler, UseMiddleware, Get, Res, NextFunction } from '../lib';
import { setupServer } from './setupServer';

const orderedMessages: string[] = [];

@UseMiddleware(
  async (_: any, __: any, next: () => void) => {
    await new Promise<void>(resolve =>
      setTimeout(() => {
        orderedMessages.length = 0;
        orderedMessages.push('[1] Before: class');
        resolve();
      }, 500)
    );
    next();
  },
  (_: any, __: any, next: NextFunction) => {
    orderedMessages.push('[2] Before: class');
    return next();
  }
)
@UseMiddleware((_: any, __: any, next: NextFunction) => {
  orderedMessages.push('[3] Before: class');
  next();
})
class TestHandler {
  @Get()
  @UseMiddleware(
    (_: any, __: any, next: () => void) => {
      orderedMessages.push('[4] Before: method');
      next();
    },
    (_: any, __: any, next: NextFunction) => {
      orderedMessages.push('[5] Before: method');
      next();
    }
  )
  @UseMiddleware((_: any, __: any, next: NextFunction) => {
    orderedMessages.push('[6] Before: method');
    next();
  })
  public dashboard(@Res() res: NextApiResponse): NextApiResponse | string {
    orderedMessages.push('Handler');
    return res.redirect('login');
  }
}

describe('E2E - Middleware - Execution order', () => {
  let server: ReturnType<typeof setupServer>;
  beforeAll(() => (server = setupServer(createHandler(TestHandler))));
  afterAll(() => {
    if ('close' in server && typeof server.close === 'function') {
      server.close();
    }
  });

  it('Should run the middlewares in correct order.', async () => {
    await request(server).get('/api/test');

    expect(orderedMessages).toHaveLength(7);
    expect(orderedMessages).toMatchObject([
      '[1] Before: class',
      '[2] Before: class',
      '[3] Before: class',
      '[4] Before: method',
      '[5] Before: method',
      '[6] Before: method',
      'Handler'
    ]);
  });
});
