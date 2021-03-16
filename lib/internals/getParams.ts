import { Key } from 'path-to-regexp';
import { decodeParam } from './decodeParam';

export function getParams(keys: Key[], match: RegExpExecArray | null | undefined): Record<string, any> {
  const params: Record<string, any> = {};

  if (keys?.length && match) {
    for (let i = 1; i < match.length; i++) {
      const key = keys[i - 1];
      const prop = key.name;
      const val = decodeParam(match[i]);

      if (val != null || !Object.hasOwnProperty.call(params, prop)) {
        params[prop] = val;
      }
    }
  }

  return params;
}
