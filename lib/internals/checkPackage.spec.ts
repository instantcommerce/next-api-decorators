import { checkPackage } from './checkPackage';

describe('loadPackage', () => {
  it('Should not log warnings for a existing package.', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    checkPackage('class-validator', 'test', 'https://example.com/');

    expect(spy).toBeCalledTimes(0);
  });

  it('Should log warnings for a non-existing package.', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    checkPackage('a-package-that-does-not-exist', 'test', 'https://example.com/');

    expect(spy).toBeCalledTimes(2);
  });
});
