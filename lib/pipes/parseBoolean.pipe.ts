import { BadRequestException } from '../exceptions';
import type { ParameterPipe, PipeOptions } from './ParameterPipe';

export function ParseBooleanPipe(options?: PipeOptions): ParameterPipe<boolean> {
  return (value: any, name?: string) => {
    if (!options?.nullable && value == null) {
      throw new BadRequestException(name ? `${name} is a required parameter.` : 'Missing a required parameter.');
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
