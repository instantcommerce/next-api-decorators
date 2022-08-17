import { applyHandler } from '../internals/handler';
import { loadPackage } from '../internals/loadPackage';

export enum HttpMethod {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
  PATCH = 'PATCH',
  OPTIONS = 'OPTIONS',
  HEAD = 'HEAD',
  CONNECT = 'CONNECT',
  TRACE = 'TRACE'
}

export interface HandlerMethod {
  method: HttpMethod;
  options?: HandlerOptions;
  path: string;
  propertyKey: string | symbol;
}

interface HandlerOptions {
  extraMethods?: HttpMethod[];
}

export const HTTP_METHOD_TOKEN = Symbol('ams:next:httpMethod');

function applyHttpMethod({ method, path, options }: { method: HttpMethod; path: string; options?: HandlerOptions }) {
  if (process.env.NODE_ENV === 'development' && path !== '/') {
    loadPackage('path-to-regexp', {
      context: '@' + method.charAt(0).toUpperCase() + method.slice(1).toLowerCase(),
      docsUrl: 'https://next-api-decorators.vercel.app/docs/routing/route-matching'
    });
  }

  return function (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const methods: Array<HandlerMethod> = Reflect.getMetadata(HTTP_METHOD_TOKEN, target.constructor) ?? [];

    methods.push({ path, method, options, propertyKey });

    Reflect.defineMetadata(HTTP_METHOD_TOKEN, methods, target.constructor);

    return applyHandler(target, propertyKey, descriptor);
  };
}

function getPath(pathOrOptions?: string | HandlerOptions) {
  return typeof pathOrOptions === 'string' ? pathOrOptions : '/';
}

function getOptions(pathOrOptions?: string | HandlerOptions, options?: HandlerOptions) {
  return typeof pathOrOptions === 'object' ? pathOrOptions : options;
}

/** Makes the method a GET request handler. */
export function Get(): MethodDecorator;
export function Get(options: HandlerOptions): MethodDecorator;
/**
 * Makes the method for the defined path a GET request handler.
 *
 * @param path Route path. Supports Express.js style [route matching](https://next-api-decorators.vercel.app/docs/routing/route-matching)
 * including route parameters (e.g. `'/:id'`) and regular expressions.
 *
 * @remarks
 * `path-to-regexp` needs to be installed, otherwise request handlers with non-empty path parameters will not be handled.
 * More information: [route matching](https://next-api-decorators.vercel.app/docs/routing/route-matching)
 */
export function Get(path: string): MethodDecorator;
export function Get(path: string, options: HandlerOptions): MethodDecorator;
export function Get(pathOrOptions?: string | HandlerOptions, options?: HandlerOptions): MethodDecorator {
  return applyHttpMethod({
    method: HttpMethod.GET,
    path: getPath(pathOrOptions),
    options: getOptions(pathOrOptions, options)
  });
}

/** Makes the method a POST request handler. */
export function Post(): MethodDecorator;
export function Post(options: HandlerOptions): MethodDecorator;
/**
 * Makes the method for the defined path a POST request handler.
 *
 * @param path Route path. Supports Express.js style [route matching](https://next-api-decorators.vercel.app/docs/routing/route-matching)
 * including route parameters (e.g. `'/:id'`) and regular expressions.
 *
 * @remarks
 * `path-to-regexp` needs to be installed, otherwise request handlers with non-empty path parameters will not be handled.
 * More information: [route matching](https://next-api-decorators.vercel.app/docs/routing/route-matching)
 */
export function Post(path: string): MethodDecorator;
export function Post(path: string, options: HandlerOptions): MethodDecorator;
export function Post(pathOrOptions?: string | HandlerOptions, options?: HandlerOptions): MethodDecorator {
  return applyHttpMethod({
    method: HttpMethod.POST,
    path: getPath(pathOrOptions),
    options: getOptions(pathOrOptions, options)
  });
}

/** Makes the method a PUT request handler. */
export function Put(): MethodDecorator;
export function Put(options: HandlerOptions): MethodDecorator;
/**
 * Makes the method for the defined path a PUT request handler.
 *
 * @param path Route path. Supports Express.js style [route matching](https://next-api-decorators.vercel.app/docs/routing/route-matching)
 * including route parameters (e.g. `'/:id'`) and regular expressions.
 *
 * @remarks
 * `path-to-regexp` needs to be installed, otherwise request handlers with non-empty path parameters will not be handled.
 * More information: [route matching](https://next-api-decorators.vercel.app/docs/routing/route-matching)
 */
export function Put(path: string): MethodDecorator;
export function Put(path: string, options: HandlerOptions): MethodDecorator;
export function Put(pathOrOptions?: string | HandlerOptions, options?: HandlerOptions): MethodDecorator {
  return applyHttpMethod({
    method: HttpMethod.PUT,
    path: getPath(pathOrOptions),
    options: getOptions(pathOrOptions, options)
  });
}

/** Makes the method a DELETE request handler. */
export function Delete(): MethodDecorator;
export function Delete(options: HandlerOptions): MethodDecorator;
/**
 * Makes the method for the defined path a DELETE request handler.
 *
 * @param path Route path. Supports Express.js style [route matching](https://next-api-decorators.vercel.app/docs/routing/route-matching)
 * including route parameters (e.g. `'/:id'`) and regular expressions.
 *
 * @remarks
 * `path-to-regexp` needs to be installed, otherwise request handlers with non-empty path parameters will not be handled.
 * More information: [route matching](https://next-api-decorators.vercel.app/docs/routing/route-matching)
 */
export function Delete(path: string): MethodDecorator;
export function Delete(path: string, options: HandlerOptions): MethodDecorator;
export function Delete(pathOrOptions?: string | HandlerOptions, options?: HandlerOptions): MethodDecorator {
  return applyHttpMethod({
    method: HttpMethod.DELETE,
    path: getPath(pathOrOptions),
    options: getOptions(pathOrOptions, options)
  });
}

/** Makes the method a PATCH request handler. */
export function Patch(): MethodDecorator;
export function Patch(options: HandlerOptions): MethodDecorator;
/**
 * Makes the method for the defined path a PATCH request handler.
 *
 * @param path Route path. Supports Express.js style [route matching](https://next-api-decorators.vercel.app/docs/routing/route-matching)
 * including route parameters (e.g. `'/:id'`) and regular expressions.
 *
 * @remarks
 * `path-to-regexp` needs to be installed, otherwise request handlers with non-empty path parameters will not be handled.
 * More information: [route matching](https://next-api-decorators.vercel.app/docs/routing/route-matching)
 */
export function Patch(path: string): MethodDecorator;
export function Patch(path: string, options: HandlerOptions): MethodDecorator;
export function Patch(pathOrOptions?: string | HandlerOptions, options?: HandlerOptions): MethodDecorator {
  return applyHttpMethod({
    method: HttpMethod.PATCH,
    path: getPath(pathOrOptions),
    options: getOptions(pathOrOptions, options)
  });
}
