import type { ClassConstructor } from 'class-transformer';
import type { NextApiRequest, NextApiResponse } from 'next';

export const CATCH_TOKEN = Symbol('ams:next:catch');

type ExceptionHandlerFunction<T> = (error: T, req: NextApiRequest, res: NextApiResponse) => void | Promise<void>;

export interface ExceptionHandler<T> {
  handler: ExceptionHandlerFunction<T>;
  exceptionType?: ClassConstructor<T>;
}

export function Catch<T>(
  fn: ExceptionHandler<T>['handler'],
  type?: ExceptionHandler<T>['exceptionType']
): ClassDecorator & MethodDecorator {
  return function (target: Function | object, propertyKey?: string | symbol) {
    const handlers: ExceptionHandler<T>[] =
      (propertyKey
        ? Reflect.getMetadata(CATCH_TOKEN, target.constructor, propertyKey)
        : Reflect.getMetadata(CATCH_TOKEN, target)) ?? [];

    handlers.unshift({ handler: fn, exceptionType: type });

    if (propertyKey) {
      Reflect.defineMetadata(CATCH_TOKEN, handlers, target.constructor, propertyKey);
    } else {
      Reflect.defineMetadata(CATCH_TOKEN, handlers, target);
    }
  };
}
