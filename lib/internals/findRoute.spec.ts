import 'reflect-metadata';
import { Get } from '../decorators';
import { findRoute } from './findRoute';
import * as lp from './loadPackage';

class Handler {
  @Get()
  public list() {
    return { list: true };
  }

  @Get('/:id(\\d+)')
  public details() {
    return { details: true };
  }

  @Get('/item')
  public item() {
    return { item: true };
  }

  @Get('/item/child-item')
  public childItem() {
    return { childItem: true };
  }
}

describe('findRoute', () => {
  it('Should return the "details" method', () => {
    const [keys, , method] = findRoute(Handler, 'GET', '/1');

    expect(keys).toHaveLength(1);
    expect(method).toMatchObject({
      path: expect.stringContaining('/:id'),
      propertyKey: 'details',
      verb: 'GET'
    });
  });

  it('Should return the "item" method', () => {
    const [keys, , method] = findRoute(Handler, 'GET', '/item');

    expect(keys).toHaveLength(0);
    expect(method).toMatchObject({
      path: '/item',
      propertyKey: 'item',
      verb: 'GET'
    });
  });

  it('Should return the "childItem" method', () => {
    const [keys, , method] = findRoute(Handler, 'GET', '/item/child-item');

    expect(keys).toHaveLength(0);
    expect(method).toMatchObject({
      path: '/item/child-item',
      propertyKey: 'childItem',
      verb: 'GET'
    });
  });

  it('Should return the main / route instead of "details" method when "path-to-regexp" is not installed.', () => {
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

  it('Should return the "item" method when "path-to-regexp" is not installed.', () => {
    const spy = jest
      .spyOn(lp, 'loadPackage')
      .mockImplementation((name: string) => (name === 'path-to-regexp' ? false : require(name)));

    const [keys, , method] = findRoute(Handler, 'GET', '/item');

    spy.mockRestore();

    expect(keys).toHaveLength(0);
    expect(method).toMatchObject({
      path: '/item',
      propertyKey: 'item',
      verb: 'GET'
    });
  });

  it('Should return the "child-item" method when "path-to-regexp" is not installed.', () => {
    const spy = jest
      .spyOn(lp, 'loadPackage')
      .mockImplementation((name: string) => (name === 'path-to-regexp' ? false : require(name)));

    const [keys, , method] = findRoute(Handler, 'GET', '/item/child-item');

    spy.mockRestore();

    expect(keys).toHaveLength(0);
    expect(method).toMatchObject({
      path: '/item/child-item',
      propertyKey: 'childItem',
      verb: 'GET'
    });
  });
});
