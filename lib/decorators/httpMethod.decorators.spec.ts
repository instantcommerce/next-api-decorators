import 'reflect-metadata';
import { Delete, Get, HTTP_METHOD_TOKEN, HttpVerb, Post, Put } from './httpMethod.decorators';

class Test {
  @Get()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public get(): void {}

  @Post()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public post(): void {}

  @Put()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public put(): void {}

  @Delete()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public delete(): void {}
}

it('Should set the HttpMethod decorator.', () => {
  const meta = Reflect.getMetadata(HTTP_METHOD_TOKEN, Test);
  expect(meta).toBeInstanceOf(Map);
  expect(meta).toMatchObject(
    new Map([
      [HttpVerb.DELETE, 'delete'],
      [HttpVerb.GET, 'get'],
      [HttpVerb.POST, 'post'],
      [HttpVerb.PUT, 'put']
    ])
  );
});
