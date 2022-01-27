import { HttpException } from './HttpException';

export class ConflictException extends HttpException {
  public name = 'ConflictException';

  /**
   * Instantiates a `ConflictException` Exception with status code 409.
   *
   * @param message Error message (default: 'Conflict')
   * @param errors Additional errors
   *
   * @example
   * `throw new ConflictException()`
   */
  public constructor(message: string = 'Conflict') {
    super(409, message);
  }
}
