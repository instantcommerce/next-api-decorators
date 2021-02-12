import { BadRequestException } from '../exceptions';
import type { ParameterPipe, PipeOptions } from './ParameterPipe';
import { validatePipeOptions } from './validatePipeOptions';

export function ParseNumberPipe(options?: PipeOptions): ParameterPipe<number> {
  return (value: any, name?: string) => {
    validatePipeOptions(value, name, options);

    const isNumeric = ['string', 'number'].includes(typeof value) && !isNaN(parseFloat(value)) && isFinite(value);
    if (!isNumeric) {
      throw new BadRequestException(`Validation failed${name ? ` for ${name}` : ''} (numeric string is expected)`);
    }

    return parseFloat(value);
  };
}
