import { NextApiRequest, NextApiResponse } from 'next';
import { CATCH_TOKEN, ExceptionHandler } from '../decorators';
import { HttpException } from '../exceptions';

function getExceptionHandlers(target: Function | object, propertyKey: string | symbol): ExceptionHandler<any>[] {
  const definedExceptionHandler =
    Reflect.getMetadata(CATCH_TOKEN, target.constructor, propertyKey) ??
    Reflect.getMetadata(CATCH_TOKEN, target.constructor);

  return definedExceptionHandler;
}

function defaultExceptionHandler(exception: unknown, res: NextApiResponse) {
  const statusCode = exception instanceof HttpException ? exception.statusCode : 500;
  const message = exception instanceof HttpException ? exception.message : 'An unknown error occurred.';
  const errors = exception instanceof HttpException && exception.errors?.length ? exception.errors : [message];

  res.status(statusCode).json({
    statusCode,
    message,
    errors,
    stack: exception instanceof Error && process.env.NODE_ENV === 'development' ? exception.stack : undefined
  });
}

export async function handleException(
  target: Function | object,
  propertyKey: string | symbol,
  exception: unknown,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const exceptionHandlers: ExceptionHandler<any>[] | undefined = getExceptionHandlers(target, propertyKey);

  if (exceptionHandlers) {
    for (const exceptionHandler of exceptionHandlers) {
      if (exceptionHandler.exceptionType && exception instanceof exceptionHandler.exceptionType) {
        return exceptionHandler.handler.call(null, exception, req, res);
      } else if (!exceptionHandler.exceptionType) {
        return exceptionHandler.handler.call(null, exception, req, res);
      }
    }
  }

  return defaultExceptionHandler(exception, res);
}
