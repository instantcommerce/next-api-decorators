import { ParameterPipe } from '../ParameterPipe';

interface DefaultValuePipeOptions {
  defaultValue: any;
}

export function DefaultValuePipe(options: DefaultValuePipeOptions): ParameterPipe<any> {
  return (value: any) => {
    if (value == null || (typeof value === 'number' && Number.isNaN(value))) {
      return options.defaultValue;
    }

    return value;
  };
}
