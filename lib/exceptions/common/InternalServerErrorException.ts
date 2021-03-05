import { HttpException } from '../HttpException';

export class InternalServerErrorException extends HttpException {
  public name = 'InternalServerErrorException';

  public constructor(message: string = 'Internal Server Error') {
    super(500, message);
  }
}
