import { ParameterPipe } from '../ParameterPipe';

export function DefaultValuePipe<T>(defaultValue: T): ParameterPipe<T> {
  return (value: any) => {
    if (value == null || (typeof value === 'number' && Number.isNaN(value))) {
      return defaultValue;
    }

    return value;
  };
}
