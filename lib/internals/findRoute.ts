import { Key } from 'path-to-regexp';
import { HandlerMethod, HTTP_METHOD_TOKEN } from '../decorators';
import { loadPackage } from './loadPackage';

export function findRoute(
  cls: Record<string, any>,
  verb: string,
  path: string
): [Key[], RegExpExecArray | null | undefined, HandlerMethod | undefined] {
  const methods: Array<HandlerMethod> = Reflect.getMetadata(HTTP_METHOD_TOKEN, cls);

  const { pathToRegexp } = loadPackage('path-to-regexp');
  if (!pathToRegexp) {
    return [[], undefined, methods.find(f => f.path === '/' && f.verb === verb)];
  }

  const keys: Key[] = [];
  let match: RegExpExecArray | null | undefined;
  const method = methods.find(f => {
    match = pathToRegexp(f.path, keys).exec(path);

    const condition = f.verb === verb && match?.length;

    if (!condition) {
      keys.length = 0;
      match = undefined;
    }

    return condition;
  });

  return [keys, match, method];
}
