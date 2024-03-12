import 'reflect-metadata';
import { Container, injectable } from 'inversify';
import request from 'supertest';
import { createHandler, Get } from '../lib';
import { setupServer } from './setupServer';

// Create service
const container = new Container({
  autoBindInjectable: true
});

interface TestData {
  test: string;
}

@injectable()
export class TestService {
  public getTest(): TestData {
    return {
      test: 'successful'
    };
  }
}

// Create handler with injection
@injectable()
class TestHandler {
  public constructor(private readonly service: TestService) {}

  @Get()
  public testData() {
    return this.service.getTest();
  }
}

describe('E2E - ioc', () => {
  let server: ReturnType<typeof setupServer>;
  beforeAll(() => (server = setupServer(createHandler(TestHandler, () => container.get(TestHandler)))));
  afterAll(() => {
    if ('close' in server && typeof server.close === 'function') {
      server.close();
    }
  });

  it('Should successfully return data from service', () =>
    request(server)
      .get('/')
      .expect(200)
      .then(res =>
        expect(res).toMatchObject({
          body: {
            test: 'successful'
          }
        })
      ));
});
