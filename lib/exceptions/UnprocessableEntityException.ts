import { HttpException } from './HttpException';

export class UnprocessableEntityException extends HttpException {
  public name = 'UnprocessableEntityException';

  /**
   * Instantiates a `UnprocessableEntityException` Exception with status code 422.
   *
   * @param message Error message (default: 'Unprocessable Entity')
   *
   * @example
   * `throw new UnprocessableEntityException()`
   */
  public constructor(message: string = 'Unprocessable Entity', errors?: string[]) {
    super(422, message, errors);
  }
}
