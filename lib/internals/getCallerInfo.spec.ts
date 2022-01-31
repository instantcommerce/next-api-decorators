import { getCallerInfo } from './getCallerInfo';

describe('getCallerInfo', () => {
  const PLATFORM = process.platform;

  afterAll(() => {
    Object.defineProperty(process, 'platform', { value: PLATFORM });
  });

  function mockError(path: string, stack?: string) {
    const spyError = jest.spyOn(global, 'Error');

    spyError.mockImplementation(() => ({
      name: 'Error',
      message: 'An error occurred.',
      stack: stack ?? `Object at (${path}:1:1)`
    }));

    return spyError;
  }

  it('getFileDirectory unix file system', () => {
    const spyError = mockError('/unix-example-path/.next/server/pages/api/tags/[id]/[[...params]].ts');
    Object.defineProperty(process, 'platform', { value: 'darwin' });

    const dir = getCallerInfo();
    expect(dir).toStrictEqual(['/unix-example-path/.next/server/pages/api/tags/[id]', '[[...params]].ts']);

    spyError.mockRestore();
  });

  it('getFileDirectory win32 file system', () => {
    const spyError = mockError('\\win-example-path\\.next\\server\\pages\\api\\tags\\[id]\\[[...params]].ts');
    Object.defineProperty(process, 'platform', { value: 'win32' });

    const dir = getCallerInfo();
    expect(dir).toStrictEqual(['/win-example-path/.next/server/pages/api/tags/[id]', '[[...params]].ts']);

    spyError.mockRestore();
  });

  it('Should get the last paranthesis of the line.', () => {
    const spyError = mockError(
      '/unix-path/.next/server/pages/api/[[...user]].js',
      'Object.(api)/./pages/api/user/[[...user]].ts (/unix-example-path/.next/server/pages/api/user/[[...user]].js:32:1)'
    );
    Object.defineProperty(process, 'platform', { value: 'darwin' });

    const dir = getCallerInfo();
    expect(dir).toStrictEqual(['/unix-example-path/.next/server/pages/api/user', '[[...user]].js']);

    spyError.mockRestore();
  });
});
