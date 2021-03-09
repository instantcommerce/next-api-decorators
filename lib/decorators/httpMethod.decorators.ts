import { Handler } from '../internals/handler';

export enum HttpVerb {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE'
}

export const HTTP_METHOD_TOKEN = Symbol('ams:next:httpMethod');

function applyHttpMethod(verb: HttpVerb) {
  return function (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const methods: Map<HttpVerb, string | symbol> =
      Reflect.getMetadata(HTTP_METHOD_TOKEN, target.constructor) ?? new Map();

    methods.set(verb, propertyKey);

    Reflect.defineMetadata(HTTP_METHOD_TOKEN, methods, target.constructor);

    Handler()(target, propertyKey, descriptor);
  };
}

/** Makes the method a GET request handler. */
export function Get(): MethodDecorator {
  return applyHttpMethod(HttpVerb.GET);
}

/** Makes the method a POST request handler. */
export function Post(): MethodDecorator {
  return applyHttpMethod(HttpVerb.POST);
}

/** Makes the method a PUT request handler. */
export function Put(): MethodDecorator {
  return applyHttpMethod(HttpVerb.PUT);
}

/** Makes the method a DELETE request handler. */
export function Delete(): MethodDecorator {
  return applyHttpMethod(HttpVerb.DELETE);
}
