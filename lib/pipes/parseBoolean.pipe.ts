import { BadRequestException } from '../exceptions';
import type { ParameterPipe, PipeOptions } from './ParameterPipe';
import { validatePipeOptions } from './validatePipeOptions';

export function ParseBooleanPipe(options?: PipeOptions): ParameterPipe<boolean> {
  return (value: any, name?: string) => {
    validatePipeOptions(value, name, options);

    if (value === true || value === 'true') {
      return true;
    }

    if (value === false || value === 'false') {
      return false;
    }

    throw new BadRequestException(`Validation failed${name ? ` for ${name}` : ''} (boolean string is expected)`);
  };
}
