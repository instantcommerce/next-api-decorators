export const HTTP_CODE_TOKEN = Symbol('ams:next:httpCode');

export function HttpCode(code: number): MethodDecorator {
  return function (target: object, propertyKey: string | symbol) {
    Reflect.defineMetadata(HTTP_CODE_TOKEN, code, target.constructor, propertyKey);
  };
}
