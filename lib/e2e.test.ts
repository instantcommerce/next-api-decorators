import 'reflect-metadata';
import express from 'express';
import type { NextApiRequest, NextApiResponse } from 'next';
import request from 'supertest';
import { createHandler } from './createHandler';
import { Body, Delete, Get, Header, HttpCode, Post, Put, Query, Req, Response, SetHeader } from './decorators';
import { ParseBooleanPipe } from './pipes/parseBoolean.pipe';
import { ParseNumberPipe } from './pipes/parseNumber.pipe';

@SetHeader('X-Api', 'true')
class TestHandler {
  private testField = 'test';

  @Get()
  @SetHeader('X-Method', 'read')
  public read(
    @Header('Content-Type') contentType: string,
    @Query('id') id: string,
    @Query('step', ParseNumberPipe) step: number,
    @Query('redirect', ParseBooleanPipe) redirect: boolean
  ) {
    return { contentType, id, step, redirect, test: this.testField };
  }

  @Post()
  @HttpCode(201)
  @SetHeader('X-Method', 'create')
  public create(@Header('Content-Type') contentType: string, @Body() body: any) {
    return { contentType, receivedBody: body, test: this.testField };
  }

  @Put()
  @SetHeader('X-Method', 'update')
  public update(@Header('Content-Type') contentType: string, @Query('id') id: string, @Body() body: any) {
    return { contentType, id, receivedBody: body, test: this.testField };
  }

  @Delete()
  @SetHeader('X-Method', 'delete')
  public delete(@Req() req: NextApiRequest, @Response() res: NextApiResponse) {
    const { headers, query, body } = req;
    const { 'content-type': contentType } = headers;
    const { id } = query;

    return res.status(200).json({ contentType, id, receivedBody: body, test: this.testField });
  }
  // public delete(@Header('Content-Type') contentType: string, @Query('id') id: string, @Body() body: any) {
  //   return { contentType, id, receivedBody: body, test: this.testField };
  // }
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

  it('read', () =>
    request(server)
      .get('/?id=my-id&step=1&redirect=true')
      .set('Content-Type', 'application/json')
      .expect(200)
      .then(res =>
        expect(res).toMatchObject({
          headers: {
            'x-api': 'true',
            'x-method': 'read'
          },
          body: {
            test: 'test',
            contentType: 'application/json',
            id: 'my-id',
            step: 1,
            redirect: true
          }
        })
      ));

  it('create', () =>
    request(server)
      .post('/')
      .send({ firstName: 'Ada', lastName: 'Lovelace', dateOfBirth: '1815-12-10' })
      .expect(201)
      .then(res =>
        expect(res).toMatchObject({
          headers: {
            'x-api': 'true',
            'x-method': 'create'
          },
          body: {
            contentType: 'application/json',
            test: 'test',
            receivedBody: {
              firstName: 'Ada',
              lastName: 'Lovelace',
              dateOfBirth: '1815-12-10'
            }
          }
        })
      ));

  it('update', () =>
    request(server)
      .put('/?id=user-id')
      .send({ firstName: 'Ada', lastName: 'Lovelace', dateOfBirth: '1815-12-10' })
      .expect(200)
      .then(res =>
        expect(res).toMatchObject({
          headers: {
            'x-api': 'true',
            'x-method': 'update'
          },
          body: {
            contentType: 'application/json',
            test: 'test',
            id: 'user-id',
            receivedBody: {
              firstName: 'Ada',
              lastName: 'Lovelace',
              dateOfBirth: '1815-12-10'
            }
          }
        })
      ));

  it('delete', () =>
    request(server)
      .delete('/?id=user-id')
      .send({ firstName: 'Ada', lastName: 'Lovelace', dateOfBirth: '1815-12-10' })
      .expect(200)
      .then(res =>
        expect(res).toMatchObject({
          headers: {
            'x-api': 'true',
            'x-method': 'delete'
          },
          body: {
            contentType: 'application/json',
            test: 'test',
            id: 'user-id',
            receivedBody: {
              firstName: 'Ada',
              lastName: 'Lovelace',
              dateOfBirth: '1815-12-10'
            }
          }
        })
      ));
});
