import { Handler } from '../internals/handler';

export enum HttpVerb {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export interface HandlerMethod {
  verb: HttpVerb;
  path: string;
  propertyKey: string | symbol;
}

export const HTTP_METHOD_TOKEN = Symbol('ams:next:httpMethod');

function applyHttpMethod(verb: HttpVerb, path: string) {
  return function (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const methods: Array<HandlerMethod> = Reflect.getMetadata(HTTP_METHOD_TOKEN, target.constructor) ?? [];

    methods.push({ path, verb, propertyKey });

    Reflect.defineMetadata(HTTP_METHOD_TOKEN, methods, target.constructor);

    Handler()(target, propertyKey, descriptor);
  };
}

/** Makes the method a GET request handler. */
export function Get(): MethodDecorator;
export function Get(path: string): MethodDecorator;
export function Get(path: string = '/'): MethodDecorator {
  return applyHttpMethod(HttpVerb.GET, path);
}

/** Makes the method a POST request handler. */
export function Post(): MethodDecorator;
export function Post(path: string): MethodDecorator;
export function Post(path: string = '/'): MethodDecorator {
  return applyHttpMethod(HttpVerb.POST, path);
}

/** Makes the method a PUT request handler. */
export function Put(): MethodDecorator;
export function Put(path: string): MethodDecorator;
export function Put(path: string = '/'): MethodDecorator {
  return applyHttpMethod(HttpVerb.PUT, path);
}

/** Makes the method a DELETE request handler. */
export function Delete(): MethodDecorator;
export function Delete(path: string): MethodDecorator;
export function Delete(path: string = '/'): MethodDecorator {
  return applyHttpMethod(HttpVerb.DELETE, path);
}
