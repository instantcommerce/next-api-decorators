import { ParameterPipe } from '../ParameterPipe';

/**
 * Assigns a default value to the parameter when its value is `null` or `undefined`.
 *
 * @remarks
 * Bare function usage has no effect.
 */
export function DefaultValuePipe<T>(defaultValue: T): ParameterPipe<T> {
  return (value: any) => {
    if (value == null || (typeof value === 'number' && Number.isNaN(value))) {
      return defaultValue;
    }

    return value;
  };
}
