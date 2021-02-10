export class HttpException extends Error {
  public statusCode: number;

  public constructor(statusCode: number, message?: string) {
    super(message);
    this.statusCode = statusCode;
  }
}
