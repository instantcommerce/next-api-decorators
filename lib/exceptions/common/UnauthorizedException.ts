import { HttpException } from '../HttpException';

export class UnauthorizedException extends HttpException {
  public name = 'UnauthorizedException';

  public constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}
