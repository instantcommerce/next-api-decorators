import { HttpException } from './HttpException';

export class NotFoundException extends HttpException {
  public name = 'NotFoundException';

  public constructor(message?: string) {
    super(404, message);
  }
}
