import { basename, extname } from 'path';
import type { NextApiRequest } from 'next';

export function parseRequestUrl(req: NextApiRequest, directoryPath?: string, fileName?: string): string {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const url = req.url!.split('?')[0];
  let path = url.split('/').slice(3).join('/');

  // The path for parametererized routes should be set to "/", in order for the methods to be matched.
  if (fileName?.startsWith('[')) {
    path = '/';
  }

  if (directoryPath && !fileName?.startsWith('[...')) {
    const pathRegExp = new RegExp(
      // "pages/api/articles/index.ts" is compiled into "pages/api/articles.js" which has to be appended to the directory path for parsing
      directoryPath.split('/.next/server/pages')[1].replace(/(\[\w+\])/, '(\\w+)') +
        (fileName && !fileName.startsWith('[...') && !fileName.startsWith('[[...')
          ? `/${basename(fileName, extname(fileName))}`
          : '')
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
