import { getCallerInfo } from './getCallerInfo';

describe('getCallerInfo', () => {
  const PLATFORM = process.platform;

  afterAll(() => {
    Object.defineProperty(process, 'platform', { value: PLATFORM });
  });

  function mockError(path: string, nextJsVersion?: number, providedStack?: string) {
    const spyError = jest.spyOn(global, 'Error');

    spyError.mockImplementation(() => {
      let stack =
        providedStack ??
        (nextJsVersion === 12_0_9
          ? `Error
  at Object.getCallerInfo (/unix-example-path/node_modules/next-api-decorators/dist/internals/getCallerInfo.js:9:30)
  at createHandler (/unix-example-path/node_modules/next-api-decorators/dist/createHandler.js:30:51)
  at eval (webpack-internal:///(api)/./${path}.ts:91:144)
  at Object.(api)/./${path}.ts (/unix-example-path/.next/server/${path}.js:32:1)
  at __webpack_require__ (/unix-example-path/.next/server/webpack-api-runtime.js:33:42)
  at __webpack_exec__ (/unix-example-path/.next/server/${path}.js:42:39)
  at /unix-example-path/.next/server/${path}.js:43:28
  at Object.<anonymous> (/unix-example-path/.next/server/${path}.js:46:3)
  at Module._compile (node:internal/modules/cjs/loader:1101:14)
  at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)`
          : `Error
  at Object.getCallerInfo (/unix-example-path/node_modules/next-api-decorators/dist/internals/getCallerInfo.js:9:30)
  at createHandler (/unix-example-path/node_modules/next-api-decorators/dist/createHandler.js:30:51)
  at eval (webpack-internal:///./${path}.ts:91:144)
  at Object../${path}.ts (/unix-example-path/.next/server/${path}.js:32:1)
  at __webpack_require__ (/unix-example-path/.next/server/webpack-api-runtime.js:33:42)
  at __webpack_exec__ (/unix-example-path/.next/server/${path}.js:42:39)
  at /unix-example-path/.next/server/${path}.js:43:28
  at Object.<anonymous> (/unix-example-path/.next/server/${path}.js:46:3)
  at Module._compile (node:internal/modules/cjs/loader:1101:14)
  at Object.Module._extensions..js (node:internal/modules/cjs/loader:1153:10)`);

      if (!providedStack && process.platform === 'win32') {
        stack = stack.replace(/\//g, '\\').replace(/\\unix-/g, 'C:\\win-');
      }

      return {
        name: 'Error',
        message: 'An error occurred.',
        stack
      };
    });

    return spyError;
  }

  it('Unix file system for NextJS 12.0.8', () => {
    const spyError = mockError('pages/api/tags/[id]/[[...params]]', 12_0_8);
    Object.defineProperty(process, 'platform', { value: 'darwin' });

    const dir = getCallerInfo();
    expect(dir).toStrictEqual(['/unix-example-path/.next/server/pages/api/tags/[id]', '[[...params]].js']);

    spyError.mockRestore();
  });

  it('Unix file system for NextJS 12.0.9', () => {
    const spyError = mockError('pages/api/tags/[id]/[[...params]]', 12_0_9);
    Object.defineProperty(process, 'platform', { value: 'darwin' });

    const dir = getCallerInfo();
    expect(dir).toStrictEqual(['/unix-example-path/.next/server/pages/api/tags/[id]', '[[...params]].js']);

    spyError.mockRestore();
  });

  it('Win32 file system for NextJS 12.0.8', () => {
    const spyError = mockError('pages\\api\\tags\\[id]\\[[...params]]', 12_0_8);
    Object.defineProperty(process, 'platform', { value: 'win32' });

    const dir = getCallerInfo();
    expect(dir).toStrictEqual(['C:/win-example-path/.next/server/pages/api/tags/[id]', '[[...params]].js']);

    spyError.mockRestore();
  });

  it('Win32 file system for NextJS 12.0.9', () => {
    const spyError = mockError('pages\\api\\tags\\[id]\\[[...params]]', 12_0_9);
    Object.defineProperty(process, 'platform', { value: 'win32' });

    const dir = getCallerInfo();
    expect(dir).toStrictEqual(['C:/win-example-path/.next/server/pages/api/tags/[id]', '[[...params]].js']);

    spyError.mockRestore();
  });

  it('Should get the last paranthesis of the line for NextJS 12.0.8.', () => {
    const spyError = mockError('pages/api/[[...user]]', 12_0_8);
    Object.defineProperty(process, 'platform', { value: 'darwin' });

    const dir = getCallerInfo();
    expect(dir).toStrictEqual(['/unix-example-path/.next/server/pages/api', '[[...user]].js']);

    spyError.mockRestore();
  });

  it('Should get the last paranthesis of the line for NextJS 12.0.9.', () => {
    const spyError = mockError('pages/api/[[...user]]', 12_0_9);
    Object.defineProperty(process, 'platform', { value: 'darwin' });

    const dir = getCallerInfo();
    expect(dir).toStrictEqual(['/unix-example-path/.next/server/pages/api', '[[...user]].js']);

    spyError.mockRestore();
  });

  test('Issue #355', () => {
    const spyError = mockError(
      'pages/api/users/deep/[[...params]]',
      undefined,
      'Error\n' +
        '    at Object.getCallerInfo (C:/Users/exampleuser/project/route-matching/node_modules/next-api-decorators/dist/internals/getCallerInfo.js:9:30)\n' +
        '    at createHandler (C:/Users/exampleuser/project/route-matching/node_modules/next-api-decorators/dist/createHandler.js:30:51)\n' +
        '    at Object../pages/api/users/deep/[[...params]].ts (C:/Users/exampleuser/project/route-matching/.next/server/pages/api/users/deep/[[...params]].js:287:142)\n' +
        '    at __webpack_require__ (C:/Users/exampleuser/project/route-matching/.next/server/webpack-runtime.js:25:42)\n' +
        '    at __webpack_exec__ (C:/Users/exampleuser/project/route-matching/.next/server/pages/api/users/deep/[[...params]].js:319:52)\n' +
        '    at C:/Users/exampleuser/project/route-matching/.next/server/pages/api/users/deep/[[...params]].js:320:28\n' +
        '    at Object.<anonymous> (C:/Users/exampleuser/project/route-matching/.next/server/pages/api/users/deep/[[...params]].js:323:3)\n' +
        '    at Module._compile (internal/modules/cjs/loader.js:1072:14)\n' +
        '    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1101:10)\n' +
        '    at Module.load (internal/modules/cjs/loader.js:937:32)'
    );
    Object.defineProperty(process, 'platform', { value: 'win32' });

    const dir = getCallerInfo();
    expect(dir).toStrictEqual([
      'C:/Users/exampleuser/project/route-matching/.next/server/pages/api/users/deep',
      '[[...params]].js'
    ]);

    spyError.mockRestore();
  });
});
