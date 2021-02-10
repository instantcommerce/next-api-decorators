export interface MetaParameter {
  index: number;
  location: 'query' | 'body' | 'header' | 'method';
  name?: string;
}

export const PARAMETER_TOKEN = Symbol('ams:next:parameters');

function addParameter(location: MetaParameter['location'], name?: MetaParameter['name']) {
  return function (target: object, propertyKey: string | symbol, parameterIndex: number) {
    const params: Array<MetaParameter> = Reflect.getMetadata(PARAMETER_TOKEN, target.constructor, propertyKey) ?? [];

    params.push({ index: parameterIndex, location, name });

    Reflect.defineMetadata(PARAMETER_TOKEN, params, target.constructor, propertyKey);
  };
}

/**
 * Returns a parameter from the query string.
 *
 * @param name Parameter name
 */
export function Query(name: string): ParameterDecorator {
  return addParameter('query', name);
}

/** Returns the request body. */
export function Body(): ParameterDecorator {
  return addParameter('body');
}

/**
 * Returns a parameter from the request header.
 *
 * @param name Parameter name
 */
export function Header(name: string): ParameterDecorator {
  return addParameter('header', name);
}
