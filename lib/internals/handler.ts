import { Stream } from 'stream';
import type { ClassConstructor } from 'class-transformer';
import type { NextApiRequest, NextApiResponse } from 'next';
import { HEADER_TOKEN, HttpVerb, HTTP_CODE_TOKEN, MetaParameter, PARAMETER_TOKEN } from '../decorators';
import { HttpException } from '../exceptions';
import { validateObject } from './classValidator';
import { notFound } from './notFound';

async function getParameterValue(
  req: NextApiRequest,
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
    default:
      return undefined;
  }
}

export function Handler(method?: HttpVerb): MethodDecorator {
  if (!method) {
    method = HttpVerb.GET;
  }

  return function (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) {
    const httpCode = Reflect.getMetadata(HTTP_CODE_TOKEN, target.constructor, propertyKey) ?? 200;
    const metaParameters: Array<MetaParameter> = (
      Reflect.getMetadata(PARAMETER_TOKEN, target.constructor, propertyKey) ?? []
    ).sort((a: MetaParameter, b: MetaParameter) => a.index - b.index);

    const originalHandler = descriptor.value;
    descriptor.value = async function (req: NextApiRequest, res: NextApiResponse) {
      if (req.method !== method) {
        return notFound(req, res);
      }

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
            let returnValue = await getParameterValue(req, bodyParamType, { location, name, index });

            if (returnValue && pipes && pipes.length) {
              pipes.forEach(pipeFn => (returnValue = pipeFn(returnValue)));
            }

            return returnValue;
          })
        );

        const returnValue = await originalHandler.call(this, ...parameters);

        classHeaders?.forEach((value, name) => res.setHeader(name, value));
        methodHeaders?.forEach((value, name) => res.setHeader(name, value));

        res.status(httpCode);

        if (returnValue instanceof Stream) {
          returnValue.pipe(res);
        } else {
          res.json(returnValue);
        }
      } catch (err) {
        console.error(err);

        if (err instanceof HttpException) {
          res.status(err.statusCode ?? 500).json({
            statusCode: err.statusCode ?? 500,
            error: err.message ?? 'An unknown error occurred.',
            errors: err.errors,
            stack: 'stack' in err && process.env.NODE_ENV === 'development' ? err.stack : undefined
          });
        } else {
          res.status(500).end();
        }
      }
    };
  };
}
