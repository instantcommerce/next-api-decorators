import 'reflect-metadata';
import fs from 'fs';
import request from 'supertest';
import { createHandler, Download, DownloadFileResult, Get, Query, SetHeader } from '../lib';
import { setupServer } from './setupServer';

class TestHandler {
  @Get()
  @Download()
  @SetHeader('Content-Type', 'text/html')
  public downloadFile(@Query('type') type: string): DownloadFileResult | undefined {
    fs.writeFileSync('./test-stream.txt', 'hello stream!');

    switch (type) {
      case 'stream':
        return {
          filename: 'stream-test.txt',
          contents: fs.createReadStream('./test-stream.txt')
        };
      case 'buffer':
        return {
          filename: 'buffer-test.txt',
          contents: Buffer.from('hello from buffer!'),
          contentType: 'text/plain'
        };
      case 'string':
        return {
          filename: 'string-test.txt',
          contents: 'hello string!',
          contentType: 'text/plain'
        };
      default:
        return undefined;
    }
  }
}

describe('E2E', () => {
  let server: ReturnType<typeof setupServer>;
  beforeAll(() => (server = setupServer(createHandler(TestHandler))));
  afterAll(() => {
    if ('close' in server && typeof server.close === 'function') {
      server.close();
    }
    fs.unlinkSync('./test-stream.txt');
  });

  it('Should return file contents from Stream object.', () =>
    request(server)
      .get('/?type=stream')
      .expect(200)
      .then(res =>
        expect(res).toMatchObject({
          header: {
            'transfer-encoding': 'chunked',
            'content-disposition': 'attachment; filename="stream-test.txt"',
            'content-type': 'text/html'
          },
          text: 'hello stream!'
        })
      ));

  it('Should return file contents from Buffer object.', () =>
    request(server)
      .get('/?type=buffer')
      .expect(200)
      .then(res =>
        expect(res).toMatchObject({
          header: {
            'content-disposition': 'attachment; filename="buffer-test.txt"'
          },
          text: 'hello from buffer!'
        })
      ));

  it('Should return string from the server.', () =>
    request(server)
      .get('/?type=string')
      .expect(200)
      .then(res =>
        expect(res).toMatchObject({
          header: {
            'content-disposition': 'attachment; filename="string-test.txt"',
            'content-type': expect.stringContaining('text/plain')
          },
          text: 'hello string!'
        })
      ));
});
