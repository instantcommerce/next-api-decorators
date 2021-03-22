import { decodeParam } from './decodeParam';

describe('decodeParam', () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  it('Should return as is when the value type is not string.', () => expect(decodeParam(0)).toStrictEqual(0));

  it('Should return as is when the value is an empty string.', () => expect(decodeParam('')).toStrictEqual(''));

  it('Should throw when the value is erroneous.', () => expect(() => decodeParam('%test')).toThrow());

  it('Should decode the encoded component.', () => expect(decodeParam('%25test')).toStrictEqual('%test'));
});
