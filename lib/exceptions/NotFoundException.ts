import { HttpException } from './HttpException';

export class NotFoundException extends HttpException {
  public name = 'NotFoundException';

  /**
   * Instantiates a `NotFoundException` Exception with status code 404.
   *
   * @param message Error message (default: 'Not found')
   *
   * @example
   * `throw new NotFoundException()`
   */
  public constructor(message: string = 'Not Found') {
    super(404, message);
  }
}
