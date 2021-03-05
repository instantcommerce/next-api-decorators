import { ValidateEnumPipe } from '../../lib/pipes';

enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BANNED = 'banned',
  DELETED = 'deleted'
}

describe('ValidateEnumPipe', () => {
  it('Should pass with a correct value', () =>
    expect(ValidateEnumPipe({ type: UserStatus })('banned', { name: 'status' })).toStrictEqual(UserStatus.BANNED));

  it('Should throw when the given value is an invalid enum value', () =>
    expect(() => ValidateEnumPipe({ type: UserStatus })('test', { name: 'status' })).toThrow());

  it('Should throw when pipe is non-nullable and the given value is undefined.', () =>
    expect(() => ValidateEnumPipe({ type: UserStatus, nullable: false })(undefined, { name: 'status' })).toThrow());

  it('Should pass when pipe is non-nullable and the given value is undefined.', () =>
    expect(ValidateEnumPipe({ type: UserStatus, nullable: true })(undefined, { name: 'status' })).toStrictEqual(
      undefined
    ));

  it('Should pass when the given value is invalid but there is no type', () =>
    expect(ValidateEnumPipe()('unknown', { name: 'status' })).toStrictEqual('unknown'));
});
