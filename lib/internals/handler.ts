import { ServerResponse } from 'http';
import { Stream } from 'stream';
import type { ClassConstructor } from 'class-transformer';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  HEADER_TOKEN,
  HTTP_CODE_TOKEN,
  HTTP_DOWNLOAD_TOKEN,
  MetaParameter,
  Middleware,
  MIDDLEWARE_TOKEN,
  NextMiddleware,
  PARAMETER_TOKEN
} from '../decorators';
import { handleException } from './exceptionHandler';
import { getParameterValue } from './getParameterValue';
import { handleMulterError } from './multerError.util';

function isResponseSent(res: ServerResponse): boolean {
  return res.writableEnded || res.finished;
}

async function runMiddlewares(
  this: TypedPropertyDescriptor<any>,
  middlewares: Middleware[],
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  for (const middleware of middlewares) {
    if (isResponseSent(res)) {
      break;
    }

    await new Promise<void>((resolve, reject) => {
      // The middleware uses the callback.
      const fnResult = (middleware as NextMiddleware).call(this, req, res, err => {
        if (err) {
          return reject(handleMulterError(err));
        }

        resolve();
      });

      // The middleware is async.
      if (fnResult instanceof Promise) {
        fnResult.then(resolve).catch(reject);
      }
    });
  }
}

async function runMainLayer(
  this: TypedPropertyDescriptor<any>,
  target: object,
  propertyKey: string | symbol,
  originalHandler: any,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const httpCode: number | undefined = Reflect.getMetadata(HTTP_CODE_TOKEN, target.constructor, propertyKey);
  const parameterDecorators: MetaParameter[] = (
    Reflect.getMetadata(PARAMETER_TOKEN, target.constructor, propertyKey) ?? []
  ).sort((a: MetaParameter, b: MetaParameter) => a.index - b.index);
  const classHeaders: Map<string, string> | undefined = Reflect.getMetadata(HEADER_TOKEN, target.constructor);
  const methodHeaders: Map<string, string> | undefined = Reflect.getMetadata(
    HEADER_TOKEN,
    target.constructor,
    propertyKey
  );
  const parameterTypes: ClassConstructor<any>[] = Reflect.getMetadata('design:paramtypes', target, propertyKey);
  const isDownloadable: boolean = Reflect.getMetadata(HTTP_DOWNLOAD_TOKEN, target.constructor, propertyKey) ?? false;

  const parameters = await Promise.all(
    parameterDecorators.map(async ({ location, name, pipes, index, fn }) => {
      if (location === 'custom') {
        return fn?.call(null, req);
      }

      const paramType =
        index < parameterTypes.length &&
        typeof parameterTypes[index] === 'function' &&
        /^class\s/.test(Function.prototype.toString.call(parameterTypes[index]))
          ? parameterTypes[index]
          : undefined;

      let returnValue = getParameterValue(req, res, {
        location,
        name,
        index
      });

      if (pipes && pipes.length) {
        for (const pipeFn of pipes) {
          returnValue = pipeFn.name
            ? // Bare pipe function. i.e: `ParseNumberPipe`
              await pipeFn.call(null, null).call(null, returnValue, { name, metaType: paramType })
            : // Pipe with options. i.e: `ParseNumberPipe({ nullable: false })`
              await pipeFn.call(null, returnValue, {
                name,
                metaType: paramType
              });
        }
      }

      return returnValue;
    })
  );

  classHeaders?.forEach((value, name) => res.setHeader(name, value));
  methodHeaders?.forEach((value, name) => res.setHeader(name, value));

  const returnValue = await originalHandler.call(this, ...parameters);

  if (returnValue instanceof ServerResponse || isResponseSent(res)) {
    return;
  }

  res.status(httpCode ?? (returnValue != null ? 200 : 204));

  if (returnValue instanceof Stream) {
    returnValue.pipe(res);
  } else if (
    isDownloadable &&
    typeof returnValue === 'object' &&
    'filename' in returnValue &&
    'contents' in returnValue
  ) {
    res.setHeader('Content-Disposition', `attachment; filename="${returnValue.filename}"`);

    if ('contentType' in returnValue) {
      res.setHeader('Content-Type', returnValue.contentType);
    }

    if (returnValue.contents instanceof Stream) {
      returnValue.contents.pipe(res);
    } else {
      res.send(returnValue.contents);
    }
  } else {
    res.send(returnValue ?? null);
  }
}

export function applyHandler(
  target: object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<any>
): TypedPropertyDescriptor<any> {
  const originalHandler = descriptor.value;

  descriptor.value = async function (req: NextApiRequest, res: NextApiResponse) {
    const classMiddlewares: Middleware[] | undefined = Reflect.getMetadata(MIDDLEWARE_TOKEN, target.constructor);
    const methodMiddlewares: Middleware[] | undefined = Reflect.getMetadata(
      MIDDLEWARE_TOKEN,
      target.constructor,
      propertyKey
    );

    try {
      await runMiddlewares.call(this, [...(classMiddlewares ?? []), ...(methodMiddlewares ?? [])], req, res);
      await runMainLayer.call(this, target, propertyKey, originalHandler, req, res);
    } catch (err) {
      await handleException(target, propertyKey, err, req, res);
    }
  };

  return descriptor;
}
