export const HEADER_TOKEN = Symbol('instant:next:header');

/**
 * Sets a header parameter into the response header.
 *
 * @param name Parameter name
 * @param value Parameter value
 */
export function SetHeader(name: string, value: string): Function {
  return function (target: object | Function, propertyKey: string) {
    switch (typeof target) {
      case 'function': {
        const classHeaders: Map<string, string> = Reflect.getMetadata(HEADER_TOKEN, target) ?? new Map();

        classHeaders.set(name, value);

        Reflect.defineMetadata(HEADER_TOKEN, classHeaders, target);
        break;
      }
      case 'object': {
        const classHeaders: Map<string, string> =
          Reflect.getMetadata(HEADER_TOKEN, target.constructor, propertyKey) ?? new Map();

        classHeaders.set(name, value);

        Reflect.defineMetadata(HEADER_TOKEN, classHeaders, target.constructor, propertyKey);
        break;
      }
    }
  };
}
