import { HttpException } from '../HttpException';

export class BadRequestException extends HttpException {
  public name = 'BadRequestException';

  public constructor(message: string = 'Bad Request', errors?: string[]) {
    super(400, message, errors);
  }
}
