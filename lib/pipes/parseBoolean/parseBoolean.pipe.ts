import { BadRequestException } from '../../exceptions';
import type { ParameterPipe, PipeOptions, PipeMetadata } from '../ParameterPipe';
import { validatePipeOptions } from '../validatePipeOptions';

export function ParseBooleanPipe(options?: PipeOptions): ParameterPipe<boolean> {
  return (value: any, metadata?: PipeMetadata) => {
    validatePipeOptions(value, metadata?.name, options);

    if (value === true || value === 'true') {
      return true;
    }

    if (value === false || value === 'false') {
      return false;
    }

    throw new BadRequestException(
      `Validation failed${metadata?.name ? ` for ${metadata.name}` : ''} (boolean string is expected)`
    );
  };
}
