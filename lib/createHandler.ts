import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { HttpVerb, HTTP_METHOD_TOKEN } from './decorators';
import { notFound } from './internals/notFound';

/**
 * Prepares a router for the given class.
 *
 * @param cls Router class
 *
 * @example
 * ```ts
 * import { createHandler, Get } from '[at]storyofams/next-api-decorators';
 *
 * class Events {
 *  Get()
 *  public events() {
 *    return [
 *      { id: 1, title: 'Event 1' },
 *      { id: 2, title: 'Event 2' }
 *    ];
 *  }
 * }
 *
 * export default createHandler(Events);
 * ```
 */
export function createHandler(cls: new (...args: any[]) => any): NextApiHandler {
  const instance = new cls();

  const methods: Map<HttpVerb, string | symbol> = Reflect.getMetadata(HTTP_METHOD_TOKEN, cls);

  return (req: NextApiRequest, res: NextApiResponse) => {
    const methodName = methods.get(req.method as HttpVerb);
    if (!methodName) {
      return notFound(req, res);
    }

    const methodFn = instance[methodName];
    if (!methodFn) {
      return notFound(req, res);
    }

    return methodFn.call(instance, req, res);
  };
}
