import type { ParameterPipe } from '../pipes/ParameterPipe';

export interface MetaParameter {
  index: number;
  location: 'query' | 'body' | 'header' | 'method' | 'request' | 'response';
  name?: string;
  pipes?: ParameterPipe<any>[];
}

export const PARAMETER_TOKEN = Symbol('ams:next:parameters');

function addParameter(location: MetaParameter['location'], name?: MetaParameter['name'], pipes?: ParameterPipe<any>[]) {
  return function (target: object, propertyKey: string | symbol, parameterIndex: number) {
    const params: Array<MetaParameter> = Reflect.getMetadata(PARAMETER_TOKEN, target.constructor, propertyKey) ?? [];

    params.push({ index: parameterIndex, location, name, pipes });

    Reflect.defineMetadata(PARAMETER_TOKEN, params, target.constructor, propertyKey);
  };
}

/** Returns the query string. */
export function Query(): ParameterDecorator;
/**
 * Returns a parameter from the query string.
 *
 * @param name Parameter name
 */
export function Query(name: string, ...pipes: ParameterPipe<any>[]): ParameterDecorator;
/**
 * Returns the query string with pipes applied.
 *
 * @param pipes Pipes to be applied.
 */
export function Query(...pipes: ParameterPipe<any>[]): ParameterDecorator;
export function Query(nameOrPipes?: string | ParameterPipe<any>, ...pipes: ParameterPipe<any>[]): ParameterDecorator {
  if (typeof nameOrPipes === 'string') {
    return addParameter('query', nameOrPipes, pipes.length ? pipes : undefined);
  } else if (typeof nameOrPipes === 'function') {
    return addParameter('query', undefined, [nameOrPipes, ...pipes]);
  } else {
    return addParameter('query', undefined);
  }
}

/** Returns the request body. */
export function Body(...pipes: ParameterPipe<any>[]): ParameterDecorator {
  return addParameter('body', undefined, pipes);
}

/**
 * Returns a parameter from the request header.
 *
 * @param name Parameter name
 */
export function Header(name: string): ParameterDecorator {
  return addParameter('header', name);
}

/** Returns the `req` object. */
export function Req(): ParameterDecorator {
  return addParameter('request');
}

/** Returns the `req` object. */
export function Request(): ParameterDecorator {
  return Req();
}

/** Returns the `res` object. */
export function Res(): ParameterDecorator {
  return addParameter('response');
}

/** Returns the `res` object. */
export function Response(): ParameterDecorator {
  return Res();
}
