import type { RequestHandler } from 'express';
import type { NextApiRequest, NextApiResponse } from 'next';

export const MIDDLEWARE_TOKEN = Symbol('ams:next:middlewares');

export type NextMiddleware = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (err?: Error) => void
) => void | Promise<void>;
export type Middleware = NextMiddleware | RequestHandler;

export interface MiddlewareLayer {
  before: Middleware[];
  after: Middleware[];
}

export enum MiddlewarePosition {
  BEFORE = 'before',
  AFTER = 'after'
}

export function createMiddlewareDecorator(
  position: MiddlewarePosition,
  middleware: Middleware
): ClassDecorator & MethodDecorator {
  return function (target: object, propertyKey?: string | symbol) {
    const definedMiddlewares: MiddlewareLayer = (propertyKey
      ? Reflect.getMetadata(MIDDLEWARE_TOKEN, target.constructor, propertyKey)
      : Reflect.getMetadata(MIDDLEWARE_TOKEN, target)) ?? { before: [], after: [] };

    definedMiddlewares[position]?.push(middleware);

    if (propertyKey) {
      Reflect.defineMetadata(MIDDLEWARE_TOKEN, definedMiddlewares, target.constructor, propertyKey);
    } else {
      Reflect.defineMetadata(MIDDLEWARE_TOKEN, definedMiddlewares, target);
    }
  };
}

export function UseBefore(...middlewares: Middleware[]): ClassDecorator & MethodDecorator {
  return function (target: object, propertyKey?: string | symbol) {
    middlewares.forEach(middleware =>
      createMiddlewareDecorator(MiddlewarePosition.BEFORE, middleware)(target, propertyKey as string, {})
    );
  };
}

export function UseAfter(...middlewares: Middleware[]): ClassDecorator & MethodDecorator {
  return function (target: object, propertyKey?: string | symbol) {
    middlewares.forEach(middleware =>
      createMiddlewareDecorator(MiddlewarePosition.AFTER, middleware)(target, propertyKey as string, {})
    );
  };
}
