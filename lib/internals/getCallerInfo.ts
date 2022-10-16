import { basename, dirname, join } from 'path';

export function getCallerInfo(): [directoryPath: string | undefined, fileName: string | undefined] {
  let errorStack = new Error().stack;
  /* istanbul ignore else */
  if (errorStack && process.platform === 'win32') {
    errorStack = errorStack.replace(/\\/g, '/');
  }

  const errorLine = errorStack?.split('\n').find(line => line.includes('/pages/api/'));
  const fileInfo = errorLine?.split(/:\d+:\d+/);
  /* istanbul ignore else */
  if (!fileInfo?.length) {
    return [undefined, undefined];
  }

  const fileName = fileInfo[0].trim().split('/pages/api/');

  return [join('/pages/api', dirname(fileName[fileName.length - 1])), basename(fileName[fileName.length - 1])];
}
