import 'reflect-metadata';
import express from 'express';
import request from 'supertest';
import { createHandler, Get, NotFoundException, Param, ParseNumberPipe, Query } from '../lib';

const DATA: Array<Record<string, any>> = [
  { id: 1, firstName: 'Ada', lastName: 'Lovelace' },
  { id: 2, firstName: 'Barbara', lastName: 'Liskov' }
];

class UserHandler {
  @Get()
  public list(@Query('q') q?: string) {
    if (q) {
      return DATA.filter(f => f.firstName.toLowerCase().includes(q) || f.lastName.toLowerCase().includes(q));
    }

    return DATA;
  }

  @Get('/:id')
  public details(@Param('id', ParseNumberPipe) id: number) {
    return {
      requestedId: id,
      person: DATA.find(f => f.id === id)
    };
  }

  @Get('/:id/:prop')
  public detailProp(@Param('id', ParseNumberPipe) id: number, @Param('prop') prop: string) {
    const obj = DATA.find(f => f.id === id);

    if (!obj) {
      throw new NotFoundException();
    }

    return obj[prop];
  }
}

describe('E2E - Params', () => {
  let server: express.Express;
  beforeAll(() => {
    server = express();
    server.use(express.json());
    const router = express.Router({ strict: true });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    router.all('*', createHandler(UserHandler));
    server.use(router);
  });

  it('Should return the list.', () =>
    request(server)
      .get('/api/user')
      .expect(200)
      .then(res => expect(res.body).toMatchObject(DATA)));

  it('Should return the filtered list.', () =>
    request(server)
      .get('/api/user/?q=lo')
      .expect(200)
      .then(res => expect(res.body).toMatchObject([DATA[0]])));

  it('Should return requestedId with the person found.', () =>
    request(server)
      .get('/api/user/2')
      .expect(200)
      .then(res =>
        expect(res.body).toMatchObject({
          requestedId: 2,
          person: expect.objectContaining(DATA[1])
        })
      ));

  it('Should return a person\'s "lastName" property.', () =>
    request(server)
      .get('/api/user/2/lastName')
      .expect(200)
      .then(res => expect(res.body).toStrictEqual('Liskov')));
});
