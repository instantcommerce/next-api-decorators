import { HttpException } from './HttpException';

describe('HttpException', () => {
  it(`Should use 'HttpException' as name`, () =>
    expect(new HttpException(500)).toHaveProperty('name', 'HttpException'));

  it('Should set the given number as statusCode', () =>
    expect(new HttpException(500)).toHaveProperty('statusCode', 500));

  it('Should set the given string as message', () =>
    expect(new HttpException(403, 'Forbidden')).toHaveProperty('message', 'Forbidden'));

  it('Should set the given array of strings as errors', () =>
    expect(
      new HttpException(400, 'Bad request', ['First name is required', 'Last name is required'])
    ).toHaveProperty('errors', ['First name is required', 'Last name is required']));

  it('Should set the name, statusCode, message and errors', () =>
    expect(new HttpException(400, 'Bad request', ['Invalid email address'])).toMatchObject({
      name: 'HttpException',
      statusCode: 400,
      message: 'Bad request',
      errors: ['Invalid email address']
    }));
});
