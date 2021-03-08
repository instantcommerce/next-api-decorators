import 'reflect-metadata';
import fs from 'fs';
import express from 'express';
import request from 'supertest';
import { createHandler, Get } from '../lib';

class TestHandler {
  @Get()
  public getStream() {
    fs.writeFileSync('./test-stream.txt', 'hello stream!');
    return fs.createReadStream('./test-stream.txt');
  }
}

describe('E2E', () => {
  let server: express.Express;
  beforeAll(() => {
    server = express();
    server.use(express.json());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    server.all('/', createHandler(TestHandler));
  });

  afterAll(() => fs.unlinkSync('./test-stream.txt'));

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
