import { DefaultValuePipe } from './defaultValue.pipe';

describe('DefaultValuePipe', () => {
  it('Should return the value (string).', () => expect(DefaultValuePipe('none')('hello')).toStrictEqual('hello'));

  it('Should return the value (number).', () => expect(DefaultValuePipe(20)(10)).toStrictEqual(10));

  it('Should return the default value.', () => expect(DefaultValuePipe('test')(undefined)).toStrictEqual('test'));

  it('Should return the default value when the value is NaN.', () =>
    expect(DefaultValuePipe('test')(NaN)).toStrictEqual('test'));
});
