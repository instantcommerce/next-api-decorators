/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  Body,
  PARAMETER_TOKEN,
  Req,
  Request,
  Res,
  Response,
  Header,
  Query,
  createParamDecorator
} from './parameter.decorators';

describe('Parameter decorators', () => {
  it('Should set the Body decorator.', () => {
    class Test {
      public index(@Body() body: any) {}
    }

    const meta = Reflect.getMetadata(PARAMETER_TOKEN, Test, 'index');
    expect(Array.isArray(meta)).toBe(true);
    expect(meta).toHaveLength(1);
    expect(meta).toMatchObject(expect.arrayContaining([expect.objectContaining({ index: 0, location: 'body' })]));
  });

  it('Should set the Header decorator for the given names.', () => {
    class Test {
      public index(@Header('Content-Type') contentType: string, @Header('Referer') referer: string): void {}
    }

    const meta = Reflect.getMetadata(PARAMETER_TOKEN, Test, 'index');
    expect(Array.isArray(meta)).toBe(true);
    expect(meta).toHaveLength(2);
    expect(meta).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({ index: 0, location: 'header', name: 'Content-Type' }),
        expect.objectContaining({ index: 1, location: 'header', name: 'Referer' })
      ])
    );
  });

  it('Should set the Query decorator for the whole query string.', () => {
    class Test {
      public index(@Query() query: any) {}
    }

    const meta = Reflect.getMetadata(PARAMETER_TOKEN, Test, 'index');
    expect(Array.isArray(meta)).toBe(true);
    expect(meta).toHaveLength(1);
    expect(meta).toMatchObject(
      expect.arrayContaining([expect.objectContaining({ index: 0, location: 'query', name: undefined })])
    );
  });

  it('Should set the Query decorator for the given keys.', () => {
    class Test {
      public index(
        @Query('firstName') firstName: string,
        @Query('lastName') lastName: string,
        @Query('city') city: string
      ): void {}
    }

    const meta = Reflect.getMetadata(PARAMETER_TOKEN, Test, 'index');
    expect(Array.isArray(meta)).toBe(true);
    expect(meta).toHaveLength(3);
    expect(meta).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({ index: 0, location: 'query', name: 'firstName' }),
        expect.objectContaining({ index: 1, location: 'query', name: 'lastName' }),
        expect.objectContaining({ index: 2, location: 'query', name: 'city' })
      ])
    );
  });

  it('Should set the Req decorator.', () => {
    class Test {
      public index(@Req() req: NextApiRequest) {}
    }

    const meta = Reflect.getMetadata(PARAMETER_TOKEN, Test, 'index');
    expect(Array.isArray(meta)).toBe(true);
    expect(meta).toHaveLength(1);
    expect(meta).toMatchObject(expect.arrayContaining([expect.objectContaining({ index: 0, location: 'request' })]));
  });

  it('Should set the Res decorator.', () => {
    class Test {
      public index(@Res() res: NextApiResponse) {}
    }

    const meta = Reflect.getMetadata(PARAMETER_TOKEN, Test, 'index');
    expect(Array.isArray(meta)).toBe(true);
    expect(meta).toHaveLength(1);
    expect(meta).toMatchObject(expect.arrayContaining([expect.objectContaining({ index: 0, location: 'response' })]));
  });

  it('Should set the Request and Response decoractors (aliases).', () => {
    class Test {
      public index(@Request() req: NextApiRequest, @Response() res: NextApiResponse) {}
    }

    const meta = Reflect.getMetadata(PARAMETER_TOKEN, Test, 'index');
    expect(Array.isArray(meta)).toBe(true);
    expect(meta).toHaveLength(2);
    expect(meta).toMatchObject(
      expect.arrayContaining([
        expect.objectContaining({ index: 0, location: 'request' }),
        expect.objectContaining({ index: 1, location: 'response' })
      ])
    );
  });

  it('Should set the custom decorator.', () => {
    /**
     * Returns the HTTP version.
     */
    const HttpVersion = createParamDecorator<string>(req => {
      return req.httpVersion;
    });

    class Test {
      public index(@HttpVersion() version: string) {}
    }

    const meta = Reflect.getMetadata(PARAMETER_TOKEN, Test, 'index');

    expect(Array.isArray(meta)).toStrictEqual(true);
    expect(meta).toHaveLength(1);
    expect(meta).toMatchObject(expect.arrayContaining([expect.objectContaining({ index: 0, location: 'custom' })]));
  });
});
