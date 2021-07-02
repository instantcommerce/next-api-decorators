import { basename, extname } from 'path';
import type { NextApiRequest } from 'next';

export function parseRequestUrl(req: NextApiRequest, directoryPath?: string, fileName?: string): string {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const url = req.url!;
  let path = url.split('?')[0].split('/').slice(3).join('/');

  // In order for the main method (e.g: `@Get()`) to be matched,
  // the path for catch all routes should be set to "/"
  if (fileName?.startsWith('[...')) {
    const qsKey = basename(fileName.replace('[...', '').replace(']', ''), extname(fileName));
    /* istanbul ignore else */
    if (req.query[qsKey]) {
      path = '';
    }
  }

  if (directoryPath && !fileName?.startsWith('[...')) {
    const pathRegExp = new RegExp(
      // "pages/api/articles/index.ts" is compiled into "pages/api/articles.js" which has to be appended to the directory path for parsing
      (directoryPath + (fileName && !fileName.startsWith('[') ? basename(fileName, extname(fileName)) : ''))
        .split('/.next/server/pages')[1]
        .replace(/(\[\w+\])/, '(\\w+)')
    );
    /* istanbul ignore else */
    if (pathRegExp.test(url)) {
      path = url.replace(pathRegExp, '');
    }
  }

  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  return path;
}
