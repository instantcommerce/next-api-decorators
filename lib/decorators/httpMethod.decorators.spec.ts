/* eslint-disable @typescript-eslint/no-empty-function */
import 'reflect-metadata';
import { Delete, Get, HTTP_METHOD_TOKEN, HttpVerb, Post, Put } from './httpMethod.decorators';

class Test {
  @Get()
  public get(): void {}

  @Post()
  public post(): void {}

  @Put()
  public put(): void {}

  @Delete()
  public delete(): void {}
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
  it('Should create all the verbs.', () => {
    const meta = Reflect.getMetadata(HTTP_METHOD_TOKEN, Test);
    expect(meta).toBeInstanceOf(Array);
    expect(meta).toMatchObject(
      expect.arrayContaining([
        { path: '/', verb: HttpVerb.GET, propertyKey: 'get' },
        { path: '/', verb: HttpVerb.POST, propertyKey: 'post' },
        { path: '/', verb: HttpVerb.PUT, propertyKey: 'put' },
        { path: '/', verb: HttpVerb.DELETE, propertyKey: 'delete' }
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
});
