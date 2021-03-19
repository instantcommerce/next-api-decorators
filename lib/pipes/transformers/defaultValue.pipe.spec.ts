import { DefaultValuePipe } from './defaultValue.pipe';

describe('DefaultValuePipe', () => {
  it('Should return the value (string).', () => expect(DefaultValuePipe('none')('hello')).toStrictEqual('hello'));

  it('Should return the value (number).', () => expect(DefaultValuePipe(20)(10)).toStrictEqual(10));

  it('Should return the default value.', () => expect(DefaultValuePipe('test')(undefined)).toStrictEqual('test'));

  it('Should return the default value when the value is NaN.', () => expect(DefaultValuePipe(0)(NaN)).toStrictEqual(0));

  it('Should return `null` when the value is `undefined`.', () =>
    expect(DefaultValuePipe(null)(undefined)).toStrictEqual(null));

  it('Should return `undefined` when the value is `null`.', () =>
    expect(DefaultValuePipe(undefined)(null)).toBeUndefined());
});
