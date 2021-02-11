import { BadRequestException } from '../exceptions';
import type { ParameterPipe, PipeOptions } from './ParameterPipe';

export function ParseBooleanPipe(options?: PipeOptions): ParameterPipe<boolean> {
  return (value: any) => {
    if (!options?.nullable && value == null) {
      throw new BadRequestException('Value needed.');
    }

    if (value === true || value === 'true') {
      return true;
    }

    if (value === false || value === 'false') {
      return false;
    }

    throw new BadRequestException('Validation failed (boolean string is expected)');
  };
}
