import { HttpException } from './HttpException';

export class BadRequestException extends HttpException {
  public name = 'BadRequestException';

  public constructor(message?: string, errors?: string[]) {
    super(400, message, errors);
  }
}
