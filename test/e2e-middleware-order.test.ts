import 'reflect-metadata';
import { NextApiResponse } from 'next';
import request from 'supertest';
import { createHandler, UseBefore, UseAfter, Get, Res } from '../lib';
import { setupServer } from './setupServer';

const orderedMessages: string[] = [];

@UseAfter((_: any, __: any, next: () => void) => {
  orderedMessages.push('After: class');
  next();
})
@UseBefore(async (_: any, __: any, next: () => void) => {
  await new Promise<void>(resolve =>
    setTimeout(() => {
      orderedMessages.length = 0;
      orderedMessages.push('Before: class');
      resolve();
    }, 500)
  );
  next();
})
class TestHandler {
  @Get()
  @UseBefore((_: any, __: any, next: () => void) => {
    orderedMessages.push('Before: method');
    next();
  })
  @UseAfter((_: any, __: any, next: () => void) => {
    orderedMessages.push('After: method');
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

    expect(orderedMessages).toHaveLength(5);
    expect(orderedMessages).toMatchObject([
      'Before: class',
      'Before: method',
      'Handler',
      'After: method',
      'After: class'
    ]);
  });
});
