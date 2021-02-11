import { BadRequestException } from '../exceptions';
import type { ParameterPipe, PipeOptions } from './ParameterPipe';

export function ParseNumberPipe(options?: PipeOptions): ParameterPipe<number> {
  return (value: any, name?: string) => {
    if (!options?.nullable && value == null) {
      throw new BadRequestException(name ? `${name} is a required parameter.` : 'Missing a required parameter');
    }

    const isNumeric = ['string', 'number'].includes(typeof value) && !isNaN(parseFloat(value)) && isFinite(value);
    if (!isNumeric) {
      throw new BadRequestException('Validation failed (numeric string is expected)');
    }
    return parseFloat(value);
  };
}
