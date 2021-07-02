import { getCallerInfo } from './getCallerInfo';

it('getFileDirectory', () => {
  const spyError = jest.spyOn(global, 'Error');
  spyError.mockImplementation(() => {
    const err = {
      name: 'Error',
      message: 'An error occurred.',
      stack: 'Object at (/example-path/.next/server/pages/api/tags/[id]/[[...params]].ts:1:1)'
    };
    return err;
  });

  const dir = getCallerInfo();
  expect(dir).toStrictEqual(['/example-path/.next/server/pages/api/tags/[id]', '[[...params]].ts']);

  spyError.mockRestore();
});
