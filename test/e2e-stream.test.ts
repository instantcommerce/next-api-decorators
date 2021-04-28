import 'reflect-metadata';
import fs from 'fs';
import request from 'supertest';
import { createHandler, Get } from '../lib';
import { setupServer } from './setupServer';

class TestHandler {
  @Get()
  public getStream() {
    fs.writeFileSync('./test-stream.txt', 'hello stream!');
    return fs.createReadStream('./test-stream.txt');
  }
}

describe('E2E - Stream', () => {
  let server: ReturnType<typeof setupServer>;
  beforeAll(() => {
    server = setupServer(createHandler(TestHandler));
  });

  afterAll(() => {
    fs.unlinkSync('./test-stream.txt');
    if ('close' in server && typeof server.close === 'function') {
      server.close();
    }
  });

  it('Should return file contents from Stream object.', () =>
    request(server)
      .get('/')
      .expect(200)
      .then(res =>
        expect(res).toMatchObject({
          header: {
            'transfer-encoding': 'chunked'
          },
          text: 'hello stream!'
        })
      ));
});
