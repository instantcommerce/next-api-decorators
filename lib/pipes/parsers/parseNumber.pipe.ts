import { BadRequestException } from '../../exceptions';
import type { ParameterPipe, PipeOptions, PipeMetadata } from '../ParameterPipe';
import { validatePipeOptions } from '../validatePipeOptions';

export function ParseNumberPipe(options?: PipeOptions): ParameterPipe<number> {
  return (value: any, metadata?: PipeMetadata) => {
    validatePipeOptions(value, metadata?.name, options);

    const isNumeric = ['string', 'number'].includes(typeof value) && !isNaN(parseFloat(value)) && isFinite(value);
    if (!isNumeric) {
      throw new BadRequestException(
        `Validation failed${metadata?.name ? ` for ${metadata.name}` : ''} (numeric string is expected)`
      );
    }

    return parseFloat(value);
  };
}
