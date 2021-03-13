import { DefaultValuePipe } from './defaultValue.pipe';

describe('DefaultValuePipe', () => {
  it('Should return the value (string).', () =>
    expect(DefaultValuePipe({ defaultValue: 'none' })('hello')).toStrictEqual('hello'));

  it('Should return the value (number).', () => expect(DefaultValuePipe({ defaultValue: 20 })(10)).toStrictEqual(10));

  it('Should return the default value.', () =>
    expect(DefaultValuePipe({ defaultValue: 'test' })(undefined)).toStrictEqual('test'));

  it('Should return the default value when the value is NaN.', () =>
    expect(DefaultValuePipe({ defaultValue: 'test' })(NaN)).toStrictEqual('test'));
});
