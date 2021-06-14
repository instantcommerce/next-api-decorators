/* istanbul ignore file */
import http from 'http';
import { parse } from 'url';
import express from 'express';
import type { NextApiHandler } from 'next';
import { apiResolver } from 'next/dist/next-server/server/api-utils';

export function setupServer(handler: NextApiHandler, disableBodyParser?: boolean): http.Server | express.Express {
  if (process.env.TEST_SERVER === 'nextjs') {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    handler.config = { api: { bodyParser: !disableBodyParser } };
    return http.createServer((req, res) => {
      const parsedUrl = parse(req.url as any, true);
      return apiResolver(req, res, parsedUrl.query, handler, {} as any, false);
    });
  }

  return express()
    .use(express.json())
    .all('*', handler as any);
}
