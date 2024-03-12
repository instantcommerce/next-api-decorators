import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { findRoute } from './internals/findRoute';
import { getCallerInfo } from './internals/getCallerInfo';
import { getParams } from './internals/getParams';
import { notFound } from './internals/notFound';
import { parseRequestUrl } from './internals/parseRequestUrl';

/**
 * Prepares a router for the given class.
 *
 * @param cls Router class
 * @param builder Router instance builder
 *
 * @example
 * ```ts
 * import { createHandler, Get } from 'next-api-decorators';
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
export function createHandler<T extends any>(
  cls: new (...args: any[]) => T,
  builder: () => T | Promise<T> = () => new cls()
): NextApiHandler {
  let instance: any;
  const [directory, fileName] = getCallerInfo();

  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!req.url || !req.method) {
      return notFound(req, res);
    }

    if (!instance) {
      instance = await builder();
    }

    const path = parseRequestUrl(req, directory, fileName);
    const [keys, match, method] = findRoute(cls, req.method, path);
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
