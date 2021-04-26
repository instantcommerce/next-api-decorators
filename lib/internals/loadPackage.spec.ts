import { loadPackage } from './loadPackage';

describe('loadPackage', () => {
  it('Should load a package correctly.', () => expect(loadPackage('class-validator')).not.toEqual(false));

  it('Should return false for a non existing package.', () =>
    expect(loadPackage('a-package-that-does-not-exist')).toEqual(false));

  it('Should not log warnings for a existing package.', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    loadPackage('class-validator', { context: 'test', docsUrl: 'https://example.com/' });

    expect(spy).toBeCalledTimes(0);

    spy.mockRestore();
  });

  it('Should log warnings for a non-existing package.', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    loadPackage('a-package-that-does-not-exist', { context: 'test', docsUrl: 'https://example.com/' });

    expect(spy).toBeCalledTimes(2);

    spy.mockRestore();
  });
});
