import { ParseDatePipe } from './parseDate.pipe';

describe('ParseDatePipe', () => {
  it('Should parse the given date', () => {
    const parsed = ParseDatePipe()('2021-01-01');
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed).toEqual(new Date('2021-01-01'));
  });

  it('Should parse the given date and time string with spaces in between.', () => {
    const parsed = ParseDatePipe()('2021-01-01 20:00:00');
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed).toEqual(new Date('2021-01-01T20:00:00'));
  });

  it('Should parse the given date and time string with T in between.', () => {
    const parsed = ParseDatePipe()('2021-01-01T20:00:00');
    expect(parsed).toBeInstanceOf(Date);
    expect(parsed).toEqual(new Date('2021-01-01T20:00:00'));
  });

  it('Should throw when then given value is not a string.', () => expect(() => ParseDatePipe()(1)).toThrow());

  it('Should pass for partial date (year and month).', () =>
    expect(ParseDatePipe()('2021-01')).toEqual(new Date('2021-01-01')));

  it('Should throw for non-existing date.', () => expect(() => ParseDatePipe()('2021-02-31')).toThrow());

  it('Should throw when the given value is string `null`.', () => {
    expect(() => ParseDatePipe()('null')).toThrow();
  });

  it('Should throw when the given value is `null`.', () => {
    expect(() => ParseDatePipe()(null)).toThrow();
  });
});
