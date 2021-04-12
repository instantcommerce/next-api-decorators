import { HttpException } from './HttpException';

export class UnprocessableEntityException extends HttpException {
  public name = 'UnprocessableEntityException';

  /**
   * Instantiates an `UnprocessableEntityException` Exception with status code 422.
   *
   * @param message Error message (default: 'Unprocessable Entity')
   * @param errors Additional errors
   *
   * @example
   * `throw new UnprocessableEntityException()`
   */
  public constructor(message: string = 'Unprocessable Entity', errors?: string[]) {
    super(422, message, errors);
  }
}
