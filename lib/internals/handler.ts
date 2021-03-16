import { ServerResponse } from 'http';
import { Stream } from 'stream';
import type { ClassConstructor } from 'class-transformer';
import type { NextApiRequest, NextApiResponse } from 'next';
import { HEADER_TOKEN, HTTP_CODE_TOKEN, MetaParameter, PARAMETER_TOKEN } from '../decorators';
import { HttpException } from '../exceptions';

function getParameterValue(
  req: NextApiRequest,
  res: NextApiResponse,
  { location, name }: MetaParameter
): string | object | undefined {
  switch (location) {
    case 'query':
      return name ? req.query[name] : req.query;
    case 'body':
      return req.body;
    case 'header':
      return name ? req.headers[name.toLowerCase()] : req.headers;
    case 'params':
      return name ? req.params[name] : req.params;
    case 'request':
      return req;
    case 'response':
      return res;
    default:
      return undefined;
  }
}

export function Handler(): MethodDecorator {
  return function (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const originalHandler = descriptor.value;
    descriptor.value = async function (req: NextApiRequest, res: NextApiResponse) {
      const httpCode: number | undefined = Reflect.getMetadata(HTTP_CODE_TOKEN, target.constructor, propertyKey);
      const metaParameters: Array<MetaParameter> = (
        Reflect.getMetadata(PARAMETER_TOKEN, target.constructor, propertyKey) ?? []
      ).sort((a: MetaParameter, b: MetaParameter) => a.index - b.index);
      const classHeaders: Map<string, string> | undefined = Reflect.getMetadata(HEADER_TOKEN, target.constructor);
      const methodHeaders: Map<string, string> | undefined = Reflect.getMetadata(
        HEADER_TOKEN,
        target.constructor,
        propertyKey
      );
      const paramTypes: ClassConstructor<any>[] = Reflect.getMetadata('design:paramtypes', target, propertyKey) ?? [];

      try {
        const parameters = await Promise.all(
          metaParameters.map(async ({ location, name, pipes, index }) => {
            const paramType =
              index < paramTypes.length && typeof paramTypes[index] === 'function' ? paramTypes[index] : undefined;

            let returnValue = getParameterValue(req, res, { location, name, index });

            if (pipes && pipes.length) {
              for (const pipeFn of pipes) {
                returnValue = pipeFn.name
                  ? // Bare pipe function. i.e: `ParseNumberPipe`
                    await pipeFn.call(null, null).call(null, returnValue, { name, metaType: paramType })
                  : // Pipe with options. i.e: `ParseNumberPipe({ nullable: false })`
                    await pipeFn.call(null, returnValue, { name, metaType: paramType });
              }
            }

            return returnValue;
          })
        );

        classHeaders?.forEach((value, name) => res.setHeader(name, value));
        methodHeaders?.forEach((value, name) => res.setHeader(name, value));

        const returnValue = await originalHandler.call(this, ...parameters);

        if (returnValue instanceof ServerResponse || res.writableEnded || res.finished) {
          return;
        }

        res.status(httpCode ?? (returnValue != null ? 200 : 204));

        if (returnValue instanceof Stream) {
          returnValue.pipe(res);
        } else {
          res.json(returnValue ?? null);
        }
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
  };
}
