import { ParseBooleanPipe } from './parseBoolean.pipe';

describe('ParseBooleanPipe', () => {
  it('Should parse the given string as boolean (true)', () => expect(ParseBooleanPipe()('true')).toStrictEqual(true));

  it('Should parse the given string as boolean (false)', () =>
    expect(ParseBooleanPipe()('false')).toStrictEqual(false));

  it('Should throw required error the given value is empty', () =>
    expect(() => ParseBooleanPipe({ nullable: false })('')).toThrow());

  it('Should pass without a value when nullable', () =>
    expect(ParseBooleanPipe({ nullable: true })(undefined)).toStrictEqual(undefined));

  it('Should throw when the given string is not a boolean string', () =>
    expect(() => ParseBooleanPipe()('test')).toThrow());
});
