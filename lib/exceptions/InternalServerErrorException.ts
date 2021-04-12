import { HttpException } from './HttpException';

export class InternalServerErrorException extends HttpException {
  public name = 'InternalServerErrorException';

  /**
   * Instantiates an `InternalServerErrorException` Exception with status code 500.
   *
   * @param message Error message (default: 'Internal Server Error')
   * @param errors Additional errors
   *
   * @example
   * `throw new InternalServerErrorException()`
   */
  public constructor(message: string = 'Internal Server Error') {
    super(500, message);
  }
}
