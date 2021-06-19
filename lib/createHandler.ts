import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { findRoute } from './internals/findRoute';
import { getParams } from './internals/getParams';
import { notFound } from './internals/notFound';

function walkUrl(classRef: new (...args: any[]) => any, url: string, method: string): ReturnType<typeof findRoute> {
  let sliceStart = 1;

  function walker(): ReturnType<typeof findRoute> {
    url = url.split('/').slice(sliceStart).join('/');

    if (!url.startsWith('/')) {
      url = '/' + url;
    }

    const result = findRoute(classRef, method, url);

    if (!result[2] && sliceStart < 5) {
      sliceStart++;
      return walker();
    }

    return result;
  }

  return walker();
}

/**
 * Prepares a router for the given class.
 *
 * @param cls Router class
 *
 * @example
 * ```ts
 * import { createHandler, Get } from '@storyofams/next-api-decorators';
 *
 * class Events {
 *  Get()
 *  public events() {
 *    return DB.findEvents();
 *  }
 * }
 *
 * export default createHandler(Events);
 * ```
 */
export function createHandler(cls: new (...args: any[]) => any): NextApiHandler {
  const instance = new cls();

  return (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.url || !req.method) {
      return notFound(req, res);
    }

    // Remove the string `api` and the directory name from the url.
    const clearedPath = req.url.split('?')[0].split('/').slice(2).join('/');
    const [keys, match, method] = walkUrl(cls, clearedPath, req.method);
    if (!method) {
      return notFound(req, res);
    }

    const methodFn = instance[method.propertyKey];
    if (!methodFn) {
      return notFound(req, res);
    }

    req.params = getParams(keys, match);

    return methodFn.call(instance, req, res);
  };
}
