import { basename, dirname } from 'path';

export function getCallerInfo(): [directoryPath: string | undefined, fileName: string | undefined] {
  let directoryPath: string | undefined;
  let fileName: string | undefined;

  const errorStack = new Error().stack?.replace(process.platform === 'win32' ? /\\/g : '/', '/');
  const parenthesisRegExp = /\(([^)]+)\)$/;
  const pathInError = errorStack
    ?.split('at ')
    .find(line => parenthesisRegExp.test(line) && line.includes('/.next/server/pages/api'));

  /* istanbul ignore else */
  if (pathInError) {
    const [, pathWithRowCol] = parenthesisRegExp.exec(pathInError) ?? [];
    /* istanbul ignore else */
    if (pathWithRowCol) {
      const fullPath = pathWithRowCol.replace(/:(\d+):(\d+)$/, '');
      directoryPath = dirname(fullPath);
      fileName = basename(fullPath);
    }
  }

  return [directoryPath, fileName];
}
