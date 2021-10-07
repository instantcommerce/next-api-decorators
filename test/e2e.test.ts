import 'reflect-metadata';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsEnum, IsInt, IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import type { NextApiRequest, NextApiResponse } from 'next';
import request from 'supertest';
import {
  createHandler,
  Body,
  Delete,
  Get,
  Header,
  HttpCode,
  Post,
  Put,
  Query,
  Req,
  Res,
  Response,
  SetHeader,
  ValidationPipe,
  ParseBooleanPipe,
  ParseDatePipe,
  ParseNumberPipe,
  NotFoundException,
  DefaultValuePipe,
  Patch
} from '../lib';
import { setupServer } from './setupServer';

enum CreateSource {
  ONLINE = 'online',
  OFFLINE = 'offline'
}

class Address {
  @IsNotEmpty()
  public city!: string;

  @IsNotEmpty()
  public country!: string;
}

class CreateDto {
  @IsNotEmpty()
  public firstName!: string;

  @IsNotEmpty()
  public lastName!: string;

  @IsInt()
  public birthYear!: number;

  @IsBoolean()
  public isActive!: boolean;

  @IsDate()
  public dateOfBirth!: Date;

  @IsDate()
  @IsOptional()
  public createdAt?: Date;

  @IsEnum(CreateSource)
  @IsOptional()
  public source?: CreateSource;

  @Type(() => Address)
  @ValidateNested()
  @IsOptional()
  public addresses?: Address[];
}

class QueryDto {
  @IsOptional()
  @IsEnum(CreateSource)
  public source?: CreateSource;
}

@SetHeader('X-Api', 'true')
class TestHandler {
  private testField = 'test';

  @Get()
  @SetHeader('X-Method', 'read')
  public read(
    @Header('Content-Type') contentType: string,
    @Query('id') id: string,
    @Query('step', ParseNumberPipe({ nullable: false })) step: number,
    @Query('redirect', ParseBooleanPipe) redirect: boolean,
    @Query('startAt', ParseDatePipe) startAt: Date,
    @Query('skip', DefaultValuePipe(0), ParseNumberPipe) skip: number,
    @Query('limit', DefaultValuePipe(20), ParseNumberPipe) limit: number
  ) {
    if (id !== 'my-id') {
      throw new NotFoundException('Invalid ID');
    }

    return {
      contentType,
      id,
      step,
      redirect,
      test: this.testField,
      startAt,
      isStartAtDateInstance: startAt instanceof Date,
      skip,
      limit
    };
  }

  @Post()
  @HttpCode(201)
  @SetHeader('X-Method', 'create')
  public create(
    @Query(ValidationPipe) query: QueryDto,
    @Header('Content-Type') contentType: string,
    @Body(ValidationPipe) body: CreateDto
  ) {
    return { ...query, contentType, receivedBody: body, test: this.testField, instanceOf: body instanceof CreateDto };
  }

  @Put()
  @SetHeader('X-Method', 'update')
  public update(@Req() req: NextApiRequest, @Res() res: NextApiResponse) {
    const { headers, query, body } = req;
    const { 'content-type': contentType } = headers;
    const { id } = query;

    res.status(200).json({ contentType, id, receivedBody: body, test: this.testField });
  }

  @Delete()
  @SetHeader('X-Method', 'delete')
  public delete(@Req() req: NextApiRequest, @Response() res: NextApiResponse) {
    const { headers, query, body } = req;
    const { 'content-type': contentType } = headers;
    const { id } = query;

    return res.status(200).json({ contentType, id, receivedBody: body, test: this.testField });
  }

  @Patch()
  public patch(@Body() body: any) {
    return body;
  }
}

describe('E2E', () => {
  let server: ReturnType<typeof setupServer>;
  beforeAll(() => (server = setupServer(createHandler(TestHandler))));
  afterAll(() => {
    if ('close' in server && typeof server.close === 'function') {
      server.close();
    }
  });

  it('Should successfully `GET` the request with a 200 status code.', () =>
    request(server)
      .get('/?id=my-id&step=1&redirect=true&startAt=2021-01-01T22:00:00&skip=10')
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
            redirect: true,
            isStartAtDateInstance: true,
            skip: 10,
            limit: 20
          }
        })
      ));

  it('Should throw a 404 error when an invalid ID is given.', () =>
    request(server)
      .get('/?id=invalid-id&step=1&redirect=true&startAt=2021-01-01T22:00:00')
      .set('Content-Type', 'application/json')
      .expect(404)
      .then(res =>
        expect(res).toMatchObject({
          body: {
            message: 'Invalid ID'
          }
        })
      ));

  it('Should return a 400 error when a required parameter is missing.', () =>
    request(server)
      .get('/?id=my-id&redirect=true')
      .set('Content-Type', 'application/json')
      .expect(400)
      .then(res =>
        expect(res).toMatchObject({
          body: {
            message: 'step is a required parameter.'
          }
        })
      ));

  it('Should successfully `POST` the request with a 201 status code.', () =>
    request(server)
      .post('/?source=online')
      .send({
        firstName: 'Ada',
        lastName: 'Lovelace',
        dateOfBirth: new Date('1815-12-10'),
        birthYear: 1815,
        isActive: true
      } as CreateDto)
      .expect(201)
      .then(res =>
        expect(res).toMatchObject({
          headers: {
            'x-api': 'true',
            'x-method': 'create'
          },
          body: {
            source: CreateSource.ONLINE,
            contentType: 'application/json',
            test: 'test',
            instanceOf: true,
            receivedBody: {
              firstName: 'Ada',
              lastName: 'Lovelace',
              dateOfBirth: '1815-12-10T00:00:00.000Z'
            }
          }
        })
      ));

  it('Should return a 400 error when "addresses[0].country" is not set.', () =>
    request(server)
      .post('/')
      .send({
        firstName: 'Ada',
        lastName: 'Lovelace',
        dateOfBirth: new Date('1815-12-10'),
        birthYear: 1815,
        isActive: true,
        addresses: [{ city: 'Amsterdam' }]
      } as CreateDto)
      .expect(400)
      .then(res =>
        expect(res).toMatchObject({
          body: {
            errors: expect.arrayContaining([expect.stringContaining('addresses.0.country should not be empty')])
          }
        })
      ));

  it('Should return a 400 error when the an invalid enum is given.', () =>
    request(server)
      .post('/')
      .send({
        firstName: 'Ada',
        lastName: 'Lovelace',
        dateOfBirth: new Date('1815-12-10'),
        birthYear: 1815,
        isActive: true,
        source: 'TEST'
      })
      .expect(400)
      .then(res =>
        expect(res).toMatchObject({
          body: {
            errors: expect.arrayContaining([expect.stringContaining('source must be a valid enum value')])
          }
        })
      ));

  it('Should successfully `PUT` the request with a 200 status code.', () =>
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

  it('Should successfully `DELETE` the request with a 200 status code.', () =>
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

  it('Should successfully `PATCH` the request with a 200 status code.', () =>
    request(server)
      .patch('/')
      .set('Content-Type', 'application/json')
      .send({ patching: true })
      .expect(200)
      .then(res => expect(res).toMatchObject({ headers: { 'x-api': 'true' }, body: { patching: true } })));

  it('Should return a express style 404 for an undefined HTTP verb.', () =>
    request(server)
      .options('/')
      .set('Content-Type', 'application/json')
      .expect(404)
      .then(res =>
        expect(res.body).toMatchObject({
          statusCode: 404,
          error: 'Not Found'
        })
      ));
});
