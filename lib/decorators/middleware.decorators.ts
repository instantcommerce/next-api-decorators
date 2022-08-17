import type { RequestHandler } from 'express';
import type { NextApiRequest, NextApiResponse } from 'next';

export const MIDDLEWARE_TOKEN = Symbol('instant:next:middlewares');

export type NextFunction = (err?: Error) => void;
export type NextMiddleware = (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => void | Promise<void>;
export type Middleware = NextMiddleware | RequestHandler;

export function createMiddlewareDecorator(middleware: Middleware) {
  return () => (target: object, propertyKey?: string | symbol): void => {
    const definedMiddlewares: Middleware[] =
      (propertyKey
        ? Reflect.getMetadata(MIDDLEWARE_TOKEN, target.constructor, propertyKey)
        : Reflect.getMetadata(MIDDLEWARE_TOKEN, target)) ?? [];

    definedMiddlewares.unshift(middleware);

    if (propertyKey) {
      Reflect.defineMetadata(MIDDLEWARE_TOKEN, definedMiddlewares, target.constructor, propertyKey);
    } else {
      Reflect.defineMetadata(MIDDLEWARE_TOKEN, definedMiddlewares, target);
    }
  };
}

export function UseMiddleware(...middlewares: Middleware[]): ClassDecorator & MethodDecorator {
  return function (target: object, propertyKey?: string | symbol) {
    middlewares.reverse().forEach(middleware => createMiddlewareDecorator(middleware)()(target, propertyKey as string));
  };
}
