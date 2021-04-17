import { loadPackage } from './loadPackage';

describe('loadPackage', () => {
  it('Should load a package correctly.', () => expect(loadPackage('class-validator', 'test')).not.toEqual(false));

  it('Should return false for a non existing package.', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();

    expect(loadPackage('a-package-that-does-not-exist', 'test')).toEqual(false);

    expect(spy).toBeCalledWith('[test] Failed to load package "a-package-that-does-not-exist".');
  });
});
