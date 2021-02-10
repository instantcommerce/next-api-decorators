import { HttpException } from './HttpException';

export class NotFoundException extends HttpException {
  public name = 'BadRequestException';

  public constructor(message?: string) {
    super(404, message);
  }
}
