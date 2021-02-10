export class HttpException extends Error {
  public name: string = 'HttpException';
  public statusCode: number;
  public errors?: string[];

  public constructor(statusCode: number, message?: string, errors?: string[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}
