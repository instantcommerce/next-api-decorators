export const HTTP_CODE_TOKEN = Symbol('ams:next:httpCode');

/**
 * Defines the HTTP response code of the route.
 *
 * @param code HTTP response code to be returned by the route handler.
 */
export function HttpCode(code: number): MethodDecorator {
  return function (target: object, propertyKey: string | symbol) {
    Reflect.defineMetadata(HTTP_CODE_TOKEN, code, target.constructor, propertyKey);
  };
}
