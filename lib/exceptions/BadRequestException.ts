import { HttpException } from './HttpException';

export class BadRequestException extends HttpException {
  public constructor(message?: string) {
    super(400, message);
  }
}
