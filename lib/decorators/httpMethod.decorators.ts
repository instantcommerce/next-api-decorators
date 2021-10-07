import { applyHandler } from '../internals/handler';
import { loadPackage } from '../internals/loadPackage';

export enum HttpVerb {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH'
}

export interface HandlerMethod {
  verb: HttpVerb;
  path: string;
  propertyKey: string | symbol;
}

export const HTTP_METHOD_TOKEN = Symbol('ams:next:httpMethod');

function applyHttpMethod(verb: HttpVerb, path: string) {
  if (process.env.NODE_ENV === 'development' && path !== '/') {
    loadPackage('path-to-regexp', {
      context: '@' + verb.charAt(0).toUpperCase() + verb.slice(1).toLowerCase(),
      docsUrl: 'https://github.com/storyofams/next-api-decorators#route-matching'
    });
  }

  return function (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const methods: Array<HandlerMethod> = Reflect.getMetadata(HTTP_METHOD_TOKEN, target.constructor) ?? [];

    methods.push({ path, verb, propertyKey });

    Reflect.defineMetadata(HTTP_METHOD_TOKEN, methods, target.constructor);

    return applyHandler(target, propertyKey, descriptor);
  };
}

/** Makes the method a GET request handler. */
export function Get(): MethodDecorator;
/**
 * Makes the method for the defined path a GET request handler.
 *
 * @param path Route path. Supports Express.js style [route matching](https://github.com/storyofams/next-api-decorators#route-matching)
 * including route parameters (e.g. `'/:id'`) and regular expressions.
 *
 * @remarks
 * `path-to-regexp` needs to be installed, otherwise request handlers with non-empty path parameters will not be handled.
 * More information: [route matching](https://github.com/storyofams/next-api-decorators#route-matching)
 */
export function Get(path: string): MethodDecorator;
export function Get(path: string = '/'): MethodDecorator {
  return applyHttpMethod(HttpVerb.GET, path);
}

/** Makes the method a POST request handler. */
export function Post(): MethodDecorator;
/**
 * Makes the method for the defined path a POST request handler.
 *
 * @param path Route path. Supports Express.js style [route matching](https://github.com/storyofams/next-api-decorators#route-matching)
 * including route parameters (e.g. `'/:id'`) and regular expressions.
 *
 * @remarks
 * `path-to-regexp` needs to be installed, otherwise request handlers with non-empty path parameters will not be handled.
 * More information: [route matching](https://github.com/storyofams/next-api-decorators#route-matching)
 */
export function Post(path: string): MethodDecorator;
export function Post(path: string = '/'): MethodDecorator {
  return applyHttpMethod(HttpVerb.POST, path);
}

/** Makes the method a PUT request handler. */
export function Put(): MethodDecorator;
/**
 * Makes the method for the defined path a PUT request handler.
 *
 * @param path Route path. Supports Express.js style [route matching](https://github.com/storyofams/next-api-decorators#route-matching)
 * including route parameters (e.g. `'/:id'`) and regular expressions.
 *
 * @remarks
 * `path-to-regexp` needs to be installed, otherwise request handlers with non-empty path parameters will not be handled.
 * More information: [route matching](https://github.com/storyofams/next-api-decorators#route-matching)
 */
export function Put(path: string): MethodDecorator;
export function Put(path: string = '/'): MethodDecorator {
  return applyHttpMethod(HttpVerb.PUT, path);
}

/** Makes the method a DELETE request handler. */
export function Delete(): MethodDecorator;
/**
 * Makes the method for the defined path a DELETE request handler.
 *
 * @param path Route path. Supports Express.js style [route matching](https://github.com/storyofams/next-api-decorators#route-matching)
 * including route parameters (e.g. `'/:id'`) and regular expressions.
 *
 * @remarks
 * `path-to-regexp` needs to be installed, otherwise request handlers with non-empty path parameters will not be handled.
 * More information: [route matching](https://github.com/storyofams/next-api-decorators#route-matching)
 */
export function Delete(path: string): MethodDecorator;
export function Delete(path: string = '/'): MethodDecorator {
  return applyHttpMethod(HttpVerb.DELETE, path);
}

/** Makes the method a PATCH request handler. */
export function Patch(): MethodDecorator;
/**
 * Makes the method for the defined path a PATCH request handler.
 *
 * @param path Route path. Supports Express.js style [route matching](https://github.com/storyofams/next-api-decorators#route-matching)
 * including route parameters (e.g. `'/:id'`) and regular expressions.
 *
 * @remarks
 * `path-to-regexp` needs to be installed, otherwise request handlers with non-empty path parameters will not be handled.
 * More information: [route matching](https://github.com/storyofams/next-api-decorators#route-matching)
 */
export function Patch(path: string): MethodDecorator;
export function Patch(path: string = '/'): MethodDecorator {
  return applyHttpMethod(HttpVerb.PATCH, path);
}
