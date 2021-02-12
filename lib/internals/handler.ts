import { ServerResponse } from 'http';
import { Stream } from 'stream';
import type { ClassConstructor } from 'class-transformer';
import type { NextApiRequest, NextApiResponse } from 'next';
import { HEADER_TOKEN, HttpVerb, HTTP_CODE_TOKEN, MetaParameter, PARAMETER_TOKEN } from '../decorators';
import { HttpException } from '../exceptions';
import { validateObject } from './classValidator';
import { notFound } from './notFound';

async function getParameterValue(
  req: NextApiRequest,
  res: NextApiResponse,
  bodyParamType: ClassConstructor<any>[],
  { location, name, index }: MetaParameter
): Promise<string | object | undefined> {
  switch (location) {
    case 'query':
      return name ? req.query[name] : req.query;
    case 'body': {
      if (index < bodyParamType.length && typeof bodyParamType[index] === 'function') {
        return validateObject(bodyParamType[index], req.body);
      }

      return req.body;
    }
    case 'header':
      return name ? req.headers[name.toLowerCase()] : req.headers;
    case 'method':
      return req.method;
    case 'request':
      return req;
    case 'response':
      return res;
    default:
      return undefined;
  }
}

export function Handler(method?: HttpVerb): MethodDecorator {
  if (!method) {
    method = HttpVerb.GET;
  }

  return function (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const originalHandler = descriptor.value;
    descriptor.value = async function (req: NextApiRequest, res: NextApiResponse) {
      if (req.method !== method) {
        return notFound(req, res);
      }

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
      const bodyParamType: ClassConstructor<any>[] =
        Reflect.getMetadata('design:paramtypes', target, propertyKey) ?? [];

      try {
        const parameters = await Promise.all(
          metaParameters.map(async ({ location, name, pipes, index }) => {
            let returnValue = await getParameterValue(req, res, bodyParamType, { location, name, index });

            if (returnValue && pipes && pipes.length) {
              pipes.forEach(pipeFn => (returnValue = pipeFn(returnValue)));
            }

            return returnValue;
          })
        );

        classHeaders?.forEach((value, name) => res.setHeader(name, value));
        methodHeaders?.forEach((value, name) => res.setHeader(name, value));

        const returnValue = await originalHandler.call(this, ...parameters);

        if (returnValue instanceof ServerResponse || res.headersSent) {
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
