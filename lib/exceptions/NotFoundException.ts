import { HttpException } from './HttpException';

export class NotFoundException extends HttpException {
  public name = 'NotFoundException';

  public constructor(message: string = 'Not found') {
    super(404, message);
  }
}
