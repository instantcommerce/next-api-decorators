import { Stream } from 'stream';
import type { NextApiRequest, NextApiResponse } from 'next';
import { HEADER_TOKEN, HttpVerb, HTTP_CODE_TOKEN, MetaParameter, PARAMETER_TOKEN } from '../decorators';
import { HttpException } from '../exceptions';
import { applyInternalPipes } from '../pipes/applyInternalPipes';
import { notFound } from './notFound';

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

      const parameters = metaParameters.map(({ location, name }) => {
        switch (location) {
          case 'query':
            return name ? applyInternalPipes(req.query[name]) : req.query;
          case 'body':
            return req.body;
          case 'header':
            return name ? applyInternalPipes(req.headers[name.toLowerCase()]) : req.headers;
          case 'method':
            return req.method;
          default:
            return undefined;
        }
      });

      try {
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
            message: err.message,
            stack: 'stack' in err && process.env.NODE_ENV === 'development' ? err.stack : undefined
          });
        } else {
          res.status(500).end();
        }
      }
    };
  };
}
