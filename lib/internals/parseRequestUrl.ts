export function parseRequestUrl(url: string, directoryPath?: string): string {
  let path = url.split('?')[0].split('/').slice(3).join('/');

  if (directoryPath) {
    const pathRegExp = new RegExp(directoryPath.split('/.next/server/pages')[1].replace(/(\[\w+\])/, '(\\w+)'));
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
