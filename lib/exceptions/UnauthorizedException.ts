import { HttpException } from './HttpException';

export class UnauthorizedException extends HttpException {
  public name = 'UnauthorizedException';

  /**
   * Instantiates an `UnauthorizedException` Exception with status code 401.
   *
   * @param message Error message (default: 'Unauthorized')
   * @param errors Additional errors
   *
   * @example
   * `throw new UnauthorizedException()`
   */
  public constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}
