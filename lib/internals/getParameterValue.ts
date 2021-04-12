import type { NextApiRequest, NextApiResponse } from 'next';
import type { MetaParameter } from '../decorators';

export function getParameterValue(
  req: NextApiRequest,
  res: NextApiResponse,
  { location, name }: MetaParameter
): string | object | undefined {
  switch (location) {
    case 'query':
      return name ? req.query[name] : req.query;
    case 'body':
      return req.body;
    case 'header':
      return name ? req.headers[name.toLowerCase()] : req.headers;
    case 'params':
      return name ? req.params[name] : req.params;
    case 'request':
      return req;
    case 'response':
      return res;
  }
}
