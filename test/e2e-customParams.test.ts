import 'reflect-metadata';
import request from 'supertest';
import { createHandler, Get } from '../lib';
import { createParamDecorator } from '../lib/decorators';
import { setupServer } from './setupServer';

const HttpVersion = createParamDecorator(req => req.httpVersion);
const User = createParamDecorator(async () => {
  return new Promise(resolve =>
    setTimeout(() => {
      resolve({ fullName: 'Hello World' });
    }, 250)
  );
});

class TestHandler {
  @Get()
  public index(@User() user: Record<string, any>, @HttpVersion() httpVersion: string) {
    return {
      httpVersion,
      user
    };
  }
}

describe('E2E - Custom parameter decorators', () => {
  let server: ReturnType<typeof setupServer>;
  beforeAll(() => {
    server = setupServer(createHandler(TestHandler));
  });

  afterAll(() => {
    if ('close' in server && typeof server.close === 'function') {
      server.close();
    }
  });

  it('Should execute custom parameter decorators.', () =>
    request(server)
      .get('/')
      .expect(200)
      .then(res =>
        expect(res.body).toMatchObject({
          httpVersion: '1.1',
          user: { fullName: 'Hello World' }
        })
      ));
});
