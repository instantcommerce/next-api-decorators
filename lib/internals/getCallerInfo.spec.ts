import { getCallerInfo } from './getCallerInfo';

describe('getCallerInfo', () => {
  const PLATFORM = process.platform;

  afterAll(() => {
    Object.defineProperty(process, 'platform', { value: PLATFORM });
  });

  function mockError(path: string) {
    const spyError = jest.spyOn(global, 'Error');

    spyError.mockImplementation(() => ({
      name: 'Error',
      message: 'An error occurred.',
      stack: `Object at (${path}:1:1)`
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
});
