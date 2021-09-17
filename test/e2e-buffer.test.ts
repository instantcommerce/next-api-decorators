import 'reflect-metadata';
import request from 'supertest';
import { createHandler, Get, SetHeader } from '../lib';
import { setupServer } from './setupServer';

const nextJsLogo = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA6UlEQVQ4ja3TMUpDYRAE4K8wYCM2kljb2IidvU2apE1ErNQcQMFCjRohx/AUXkOPYERvYBUkihKLf5+8BM3LEwe2WXaGf2b35x+xiibaBdWM2Qlc4B0jvBTUCG/oZuQOhmhhYY6XVmJ2iAN4xGUZr4ErPMAn6ljBxhzEdawF5wPG2MaulMPxDHIHrzgJzjgvAHuSt1ss54iLuJECPIrejwKwGd6ecIZTDPCMrdzcrwKwhGvc4R79qRdNCGQhlsV3iAN/W2NPrPFQCq4tHUkRKtgJzn7W7ErnWeaUz6eVa2go/kwNVEtYnY0vxaFKHj8ZCrUAAAAASUVORK5CYII=',
  'base64'
);

class TestHandler {
  @Get()
  @SetHeader('Content-Type', 'image/png')
  public image() {
    return nextJsLogo;
  }
}

describe('E2E - Buffer', () => {
  let server: ReturnType<typeof setupServer>;
  beforeAll(() => {
    server = setupServer(createHandler(TestHandler));
  });

  afterAll(() => {
    if ('close' in server && typeof server.close === 'function') {
      server.close();
    }
  });

  it('Should return the image with the correct headers.', () =>
    request(server)
      .get('/')
      .expect(200)
      .then(res =>
        expect(res).toMatchObject({
          header: {
            'content-type': 'image/png',
            'content-length': nextJsLogo.length.toString()
          },
          body: nextJsLogo
        })
      ));
});
