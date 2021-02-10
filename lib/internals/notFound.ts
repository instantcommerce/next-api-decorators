import type { NextApiRequest, NextApiResponse } from 'next';

export function notFound(req: NextApiRequest, res: NextApiResponse): void {
  return res.status(404).json({
    statusCode: 404,
    message: `Cannot ${req.method} ${req.url?.split('?')?.[0]}`,
    error: 'Not Found'
  });
}
