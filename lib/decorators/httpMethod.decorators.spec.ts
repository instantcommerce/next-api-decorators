/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import * as lp from '../internals/loadPackage';
import { Get, Post, Put, Delete, HttpVerb, HTTP_METHOD_TOKEN, Patch } from './httpMethod.decorators';

class Test {
  @Get()
  public get(): void {}

  @Post()
  public post(): void {}

  @Put()
  public put(): void {}

  @Delete()
  public delete(): void {}

  @Patch()
  public patch(): void {}
}

class TestPath {
  @Get()
  public index() {}

  @Get('/explore')
  public explore() {}

  @Get('/explore/:id')
  public exploreDetails() {}

  @Get('/explore/:id/comments')
  public exploreDetailsComments() {}

  @Get('/explore/:id/comments/:commentId')
  public exploreDetailsCommentDetails() {}
}

describe('HttpMethod decorator', () => {
  const ENV = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...ENV };
  });

  afterAll(() => {
    process.env = ENV;
  });

  it('Should create all the verbs.', () => {
    const meta = Reflect.getMetadata(HTTP_METHOD_TOKEN, Test);
    expect(meta).toBeInstanceOf(Array);
    expect(meta).toMatchObject(
      expect.arrayContaining([
        { path: '/', verb: HttpVerb.GET, propertyKey: 'get' },
        { path: '/', verb: HttpVerb.POST, propertyKey: 'post' },
        { path: '/', verb: HttpVerb.PUT, propertyKey: 'put' },
        { path: '/', verb: HttpVerb.DELETE, propertyKey: 'delete' },
        { path: '/', verb: HttpVerb.PATCH, propertyKey: 'patch' }
      ])
    );
  });

  it('Should create the GET verb with paths', () => {
    const meta = Reflect.getMetadata(HTTP_METHOD_TOKEN, TestPath);
    expect(meta).toBeInstanceOf(Array);
    expect(meta).toMatchObject(
      expect.arrayContaining([
        { path: '/', verb: HttpVerb.GET, propertyKey: 'index' },
        { path: '/explore', verb: HttpVerb.GET, propertyKey: 'explore' },
        { path: '/explore/:id', verb: HttpVerb.GET, propertyKey: 'exploreDetails' },
        { path: '/explore/:id/comments', verb: HttpVerb.GET, propertyKey: 'exploreDetailsComments' },
        { path: '/explore/:id/comments/:commentId', verb: HttpVerb.GET, propertyKey: 'exploreDetailsCommentDetails' }
      ])
    );
  });

  it('Should check if "path-to-regexp" is installed if a regex is used.', async () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    process.env.NODE_ENV = 'development';

    const spy = jest.spyOn(lp, 'loadPackage');

    Get('/:id');
    Put('/:id');
    Post('/:id');
    Delete('/:id');
    Patch('/:id');

    ['@Get', '@Put', '@Post', '@Delete', '@Patch'].forEach(decoratorName =>
      expect(spy).toHaveBeenCalledWith('path-to-regexp', {
        context: decoratorName,
        docsUrl: expect.stringContaining('https://')
      })
    );
  });
});
