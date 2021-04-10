import 'reflect-metadata';
import { Get } from '../decorators';
import { findRoute } from './findRoute';
import * as lp from './loadPackage';

class Handler {
  @Get()
  public list() {
    return { list: true };
  }

  @Get('/:id')
  public details() {
    return { details: true };
  }
}

describe('findRoute', () => {
  it('Should return the "details" method', () => {
    const [keys, , method] = findRoute(Handler, 'GET', '/1');

    expect(keys).toHaveLength(1);
    expect(method).toMatchObject({
      path: '/:id',
      propertyKey: 'details',
      verb: 'GET'
    });
  });

  it('Should return the main / route when "path-to-regexp" is not installed.', () => {
    const spy = jest
      .spyOn(lp, 'loadPackage')
      .mockImplementation((name: string) => (name === 'path-to-regexp' ? false : require(name)));

    const [, , method] = findRoute(Handler, 'GET', '/1');

    spy.mockRestore();

    expect(method).toMatchObject({
      path: '/',
      propertyKey: 'list',
      verb: 'GET'
    });
  });
});
