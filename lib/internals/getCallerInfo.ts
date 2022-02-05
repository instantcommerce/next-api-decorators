import { basename, dirname } from 'path';

export function getCallerInfo(): [directoryPath: string | undefined, fileName: string | undefined] {
  let directoryPath: string | undefined;
  let fileName: string | undefined;

  let errorStack = new Error().stack;
  if (errorStack && process.platform === 'win32') {
    errorStack = errorStack.replace(/\\/g, '/');
  }

  const parenthesisRegExp = /\(([^)]+)\)$/;
  const pathInError = errorStack
    ?.split('\n')
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
