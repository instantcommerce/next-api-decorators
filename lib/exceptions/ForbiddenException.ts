import { HttpException } from './HttpException';

export class ForbiddenException extends HttpException {
  public name = 'ForbiddenException';

  /**
   * Instantiates a `ForbiddenException` Exception with status code 403.
   *
   * @param message Error message (default: 'Forbidden')
   * @param errors Additional errors
   *
   * @example
   * `throw new ForbiddenException()`
   */
  public constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}
