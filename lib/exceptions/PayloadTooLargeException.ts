import { HttpException } from './HttpException';

export class PayloadTooLargeException extends HttpException {
  public name = 'PayloadTooLargeException';

  /**
   * Instantiates a `PayloadTooLargeException` Exception with status code 413.
   *
   * @param message Error message (default: 'Payload Too Large')
   * @param errors Additional errors
   *
   * @example
   * `throw new PayloadTooLargeException()`
   */
  public constructor(message: string = 'Payload Too Large', errors?: string[]) {
    super(413, message, errors);
  }
}
