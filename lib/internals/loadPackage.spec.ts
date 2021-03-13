import { loadPackage } from './loadPackage';

describe('loadPackage', () => {
  it('Should load a package correctly.', () => expect(loadPackage('class-validator')).not.toEqual(false));

  it('Should return false for a non existing package.', () =>
    expect(loadPackage('a-package-that-does-not-exist')).toEqual(false));
});
