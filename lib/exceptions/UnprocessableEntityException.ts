import { HttpException } from './HttpException';

export class UnprocessableEntityException extends HttpException {
  public name = 'UnprocessableEntityException';

  public constructor(message: string = 'Unprocessable Entity', errors?: string[]) {
    super(422, message, errors);
  }
}
