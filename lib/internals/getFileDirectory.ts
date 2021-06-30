import { dirname } from 'path';

export function getFileDirectory(): string | undefined {
  let directoryPath: string | undefined;

  const parenthesisRegExp = /\(([^)]+)\)/;
  const pathInError = new Error().stack
    ?.split('at ')
    .find(line => parenthesisRegExp.test(line) && line.includes('/.next/server/pages/api'));

  /* istanbul ignore else */
  if (pathInError) {
    const [, pathWithRowCol] = parenthesisRegExp.exec(pathInError) ?? [];
    /* istanbul ignore else */
    if (pathWithRowCol) {
      directoryPath = dirname(pathWithRowCol.replace(/:(\d+):(\d+)$/, ''));
    }
  }

  return directoryPath;
}
