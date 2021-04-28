import { ServerResponse } from 'http';
import { Stream } from 'stream';
import type { ClassConstructor } from 'class-transformer';
import type { NextApiRequest, NextApiResponse } from 'next';
import {
  HEADER_TOKEN,
  HTTP_CODE_TOKEN,
  HTTP_DOWNLOAD_TOKEN,
  MetaParameter,
  MiddlewareLayer,
  MiddlewarePosition,
  MIDDLEWARE_TOKEN,
  NextMiddleware,
  PARAMETER_TOKEN
} from '../decorators';
import { HttpException } from '../exceptions';
import { getParameterValue } from './getParameterValue';
import { handleMulterError } from './multerError.util';

function isResponseSent(res: ServerResponse): boolean {
  return res.writableEnded || res.finished;
}

async function runMiddlewares(
  this: TypedPropertyDescriptor<any>,
  layers: [MiddlewareLayer | undefined, MiddlewareLayer | undefined],
  position: MiddlewarePosition,
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  for (const layer of layers) {
    if (!layer || !layer[position]) {
      continue;
    }

    for (const middlewareFn of layer[position]) {
      if (position === MiddlewarePosition.BEFORE && isResponseSent(res)) {
        break;
      }

      await new Promise<void>((resolve, reject) => {
        (middlewareFn as NextMiddleware).call(this, req, res, err => {
          if (err) {
            return reject(handleMulterError(err));
          }

          resolve();
        });
      });
    }
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
  const parameterTypes: ClassConstructor<any>[] = Reflect.getMetadata('design:paramtypes', target, propertyKey) ?? [];
  const isDownloadable: boolean = Reflect.getMetadata(HTTP_DOWNLOAD_TOKEN, target.constructor, propertyKey) ?? false;

  const parameters = await Promise.all(
    parameterDecorators.map(async ({ location, name, pipes, index }) => {
      const paramType =
        index < parameterTypes.length && typeof parameterTypes[index] === 'function'
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
    res.json(returnValue ?? null);
  }
}

export function applyHandler(
  target: object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<any>
): void {
  const originalHandler = descriptor.value;
  descriptor.value = async function (req: NextApiRequest, res: NextApiResponse) {
    const classMiddlewares: MiddlewareLayer | undefined = Reflect.getMetadata(MIDDLEWARE_TOKEN, target.constructor);
    const methodMiddlewares: MiddlewareLayer | undefined = Reflect.getMetadata(
      MIDDLEWARE_TOKEN,
      target.constructor,
      propertyKey
    );

    try {
      await runMiddlewares.call(this, [classMiddlewares, methodMiddlewares], MiddlewarePosition.BEFORE, req, res);
      await runMainLayer.call(this, target, propertyKey, originalHandler, req, res);
      await runMiddlewares.call(this, [methodMiddlewares, classMiddlewares], MiddlewarePosition.AFTER, req, res);
    } catch (err) {
      const statusCode = err instanceof HttpException ? err.statusCode : 500;
      const message = err instanceof HttpException ? err.message : 'An unknown error occurred.';
      const errors = err instanceof HttpException && err.errors?.length ? err.errors : [message];

      res.status(statusCode).json({
        statusCode,
        message,
        errors,
        stack: 'stack' in err && process.env.NODE_ENV === 'development' ? err.stack : undefined
      });
    }
  };
}
