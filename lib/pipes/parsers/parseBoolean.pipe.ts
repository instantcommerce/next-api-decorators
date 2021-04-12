import { BadRequestException } from '../../exceptions';
import type { ParameterPipe, PipeOptions, PipeMetadata } from '../ParameterPipe';
import { validateNullable } from '../validateNullable';
import { validatePipeOptions } from '../validatePipeOptions';

/** Validates and transforms `Boolean` strings. Allows `'true'` and `'false'`. */
export function ParseBooleanPipe(options?: PipeOptions): ParameterPipe<boolean> {
  return (value: any, metadata?: PipeMetadata) => {
    validatePipeOptions(value, metadata?.name, options);

    if (validateNullable(value, options?.nullable)) {
      return undefined;
    }

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
