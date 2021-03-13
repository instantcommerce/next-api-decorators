import {
  HttpException,
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException
} from '.';

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

  describe('Default errors', () => {
    it('Should set the default status codes', () => {
      expect(new BadRequestException()).toHaveProperty('statusCode', 400);
      expect(new InternalServerErrorException()).toHaveProperty('statusCode', 500);
      expect(new NotFoundException()).toHaveProperty('statusCode', 404);
      expect(new UnauthorizedException()).toHaveProperty('statusCode', 401);
      expect(new UnprocessableEntityException()).toHaveProperty('statusCode', 422);
    });

    it('Should set the default error messages', () => {
      expect(new BadRequestException()).toHaveProperty('message', 'Bad Request');
      expect(new InternalServerErrorException()).toHaveProperty('message', 'Internal Server Error');
      expect(new NotFoundException()).toHaveProperty('message', 'Not Found');
      expect(new UnauthorizedException()).toHaveProperty('message', 'Unauthorized');
      expect(new UnprocessableEntityException()).toHaveProperty('message', 'Unprocessable Entity');
    });
  });
});
